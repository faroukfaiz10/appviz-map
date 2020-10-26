/**
 * View of a zone.
 */
import View from "./view"
import LayerBuilder from "../core/layerBuilder"
import TextUtils  from "../utils/textutils"

import Zone from "./elements/zone"
import Group from "./elements/group"

import PxPosition from "../layout/pxPosition"
import GridPosition from "../layout/gridPosition"
import PxSize from "../layout/pxSize"
import GridSize from "../layout/gridSize"

import ModelRepository from "../model/modelRepository"

import {Layout, ItemNamePrefix, ItemTypeName, ItemTypeFrequencies, ElementLayout } from "../types/types"

import {style, projection} from "../sketch"
import ItemModel from "../model/itemModel"

export default class TechZoneView extends View {

    #types: {[itemNamePrefix in ItemNamePrefix]: ItemTypeName} = {
        dt: "data",
        tk: "task"
    }

    provideLayers(modelRepository: ModelRepository, layout: Layout) {
        return [
            this.createZoneLayer(layout),
            this.createGroupLayer(modelRepository, layout)
        ]
    }

    private createZoneLayer(layout: Layout) {
        const zonesLayerBuilder = new LayerBuilder()

        for (const zoneName in layout.zones) {
            const zoneLayout = layout.zones[zoneName]
            const zonePxSize = projection.gridToPxSize(new GridSize(zoneLayout.numOfColumns, zoneLayout.numOfRows))
            const zonePxPosition = projection.gridToPxPosition(new GridPosition(zoneLayout.column, zoneLayout.row))
            zonesLayerBuilder.addElement(
                new Zone(
                    zoneName,
                    zonePxSize,
                    TextUtils.firstCharUpperCase(zoneName),
                    this.getZoneColor(zoneName)
                ),
                zonePxPosition
            )
        }

        return zonesLayerBuilder.build();
    }


    private createGroupLayer(modelRepository: ModelRepository, layout: Layout) {
        const groupsLayerBuilder = new LayerBuilder()

        for (const groupName in layout.groups) {
            const groupModel = modelRepository.getGroupModels().find(groupModel =>
                groupModel.getTitle() === groupName
            ) 
            if (groupModel !== undefined){
                const groupLayout = layout.groups[groupName]
                const padding = this.getGroupPadding(groupLayout, layout.zones[groupModel.getType()])
                const itemTypeFrequencies = this.getItemTypeFrequencies(groupModel.getItemModels())
                const groupPxSize = projection.gridToPxSize(new GridSize(groupLayout.numOfColumns, groupLayout.numOfRows))
                const groupPxPosition = projection.gridToPxPosition(new GridPosition(groupLayout.column, groupLayout.row))
                const paddedGroupPxPosition = new PxPosition(groupPxPosition.getX() + padding.left, groupPxPosition.getY() + padding.top)
                groupsLayerBuilder.addElement(
                    new Group(
                        groupModel.getId(),
                        new PxSize ( groupPxSize.getWidth() - padding.right - padding.left,
                        groupPxSize.getHeight() - padding.top - padding.bottom),
                        TextUtils.firstCharUpperCase(groupName),
                        itemTypeFrequencies,
                        this.getZoneColor(groupModel.getType())
                    ),
                    paddedGroupPxPosition
                )
            }
        }

        return groupsLayerBuilder.build();
    }

    private getGroupPadding(group: ElementLayout, zone: ElementLayout) { // TO DO : Rename to groupLayout and zoneLayout ?
        const paddingStep = 5

        const left = (zone.column == group.column)
        ? 2 * paddingStep
        : paddingStep
        const right = ((zone.column + zone.numOfColumns) == (group.column + group.numOfColumns))
        ? 2 * paddingStep
        : paddingStep
        const top = (zone.row == group.row)
        ? 2 * paddingStep
        : paddingStep
        const bottom = ((zone.row + zone.numOfRows) == (group.row + group.numOfRows))
        ? 2 * paddingStep
        : paddingStep

        return { left, top, right, bottom }
    }

    private getItemTypeFrequencies(itemsModels: ItemModel[]){
        const itemTypeFrequencies: ItemTypeFrequencies = {}
        for (const typePrefix in this.#types){
            itemTypeFrequencies[this.#types[typePrefix as ItemNamePrefix]] = 0
        }
        for(const itemModel of itemsModels){
            const itemModelType = itemModel.getType()
            if(Object.keys(itemTypeFrequencies).includes(itemModelType)){
                (itemTypeFrequencies[itemModelType] as number)++
            }
        }
        return itemTypeFrequencies
    }

    private getZoneColor(zone: string){
        switch (zone) {
            case "pilotage":
                return style.color.b
            case "operationnel":
                return style.color.a
            case "referentiel":
                return style.color.c
            default:
                return style.color.undefined
        }
    }

}