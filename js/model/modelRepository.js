class ModelRepository{
    #groupModels

    /**
     * @constructor
     * 
     * @param {GroupModel[]} groupModels 
     */
    constructor(groupModels){
        this.#groupModels = groupModels
    }

    /**
     * @returns {groupModels[]} groupModels
     */
    getGroupModels(){
        return this.#groupModels
    }

    // getGroupTypes() -> string[]

    // getGroupModelsByType(type: string) -> groupModel[]
    getGroupModelById(id){
        const groupModel = this.getGroupModels().find(groupModel => 
            groupModel.getId() === id)

        if (groupModel) {
            return groupModel
        }   
        throw 'no data found'
    }
}