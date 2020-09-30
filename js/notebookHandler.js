class NotebookHandler {
  #types = {
    dt: "objects",
    tk: "tasks"
  };
  constructor(notebookPath) {
    this.notebook = loadJSON(notebookPath);
  }

  handle(fake) {
    const domains = this.#extractDomains();
    if (!group) {
      return this.#generateDomainsMap(domains, fake);
    } else {
      return this.#generateGroupMap(domains, fake, group);
    }
  }

  #extractType(domains, sketchName) {
    const typePrefix = sketchName.slice(0, 2).toLowerCase();
    const domainName = this.notebook.sketches[sketchName].packageName.split(
      "."
    )[2];
    if (domains[domainName]) {
      if (domains[domainName][this.#types[typePrefix]])
        domains[domainName][this.#types[typePrefix]].push(sketchName);
      else domains[domainName][this.#types[typePrefix]] = [sketchName];
    } else domains[domainName] = {
      [this.#types[typePrefix]]: [sketchName]
    };
  }

  #extractDomains() {
    const domains = {};
    Object.keys(this.notebook.sketches).map((sketchName) => {
      for (const typePrefix in this.#types) {
        if (sketchName.slice(0, 2).toLowerCase() === typePrefix)
          this.#extractType(domains, sketchName);
      }
    });
    return domains;
  }

  #generateDomainsMap(domains, fake) {
    const backgroundLayerBuilder = new LayerBuilder();
    const zonesLayerBuilder = new LayerBuilder();
    const groupsLayerBuilder = new LayerBuilder();
    const itemsLayerBuilder = new LayerBuilder();
    const gridLayerBuilder = new LayerBuilder();

    backgroundLayerBuilder.addElement(new Background(BACKGROUND_COLOR));
    gridLayerBuilder.addElement(new Grid(12, 12, styles.domainsView.grid));

    Object.keys(fake.zones).forEach((zoneName) => {
      const zone = fake.zones[zoneName];
      const {
        x,
        y,
        width,
        height
      } = this.#getPixels(
        zone.row,
        zone.column,
        zone.numOfRows,
        zone.numOfColumns
      );
      zonesLayerBuilder.addElement(
        new Rectangle(
          width,
          height,
          this.#firstCharUpperCase(zoneName),
          styles.domainsView.zones,
          true,
          true
        ),
        x,
        y
      );

      Object.keys(zone.groups).forEach((groupName) => {
        let pt = 5; // top
        let pl = 5; // left
        let pb = 5; // bottom
        let pr = 5; // right
        const group = zone.groups[groupName];
        const {
          x,
          y,
          width,
          height
        } = this.#getPixels(
          group.row,
          group.column,
          group.numOfRows,
          group.numOfColumns
        );
        if (zone.column == group.column) {
          pl += 5
        }
        if (zone.column + zone.numOfColumns == group.column + group.numOfColumns) {
          pr += 5
        }
        if (zone.row == group.row) {
          pt += 5
        }
        if (zone.row + zone.numOfRows == group.row + group.numOfRows) {
          pb += 5
        }
        groupsLayerBuilder.addElement(
          new Rectangle(
            width - pr - pl,
            height - pt - pb,
            this.#firstCharUpperCase(groupName),
            styles.domainsView[zoneName]
          ),
          x + pl,
          y + pt
        );
        const top = y + pt + 40; // TO DO : Use title textAscent to compute
        const bottom = y + height - pb - 10;
        Object.keys(this.#types).forEach((typePrefix, index) => {
          itemsLayerBuilder.addElement(
            new ItemType(
              typePrefix,
              domains[groupName][this.#types[typePrefix]] ?
              domains[groupName][this.#types[typePrefix]].length :
              0,
              width - pl - pr,
              styles.domainsView.items
            ),
            x + pl,
            top +
            ((2 * index + 1) * (bottom - top)) /
            (2 * Object.keys(this.#types).length)
          );
        });
      });
    });



    return new MapBuilder()
      .addLayer(backgroundLayerBuilder.build())
      .addLayer(zonesLayerBuilder.build())
      .addLayer(groupsLayerBuilder.build())
      .addLayer(itemsLayerBuilder.build())
      .addLayer(gridLayerBuilder.build())
      .build();
  }

  #generateGroupMap(domains, fake, groupName) {
    const backgroundLayerBuilder = new LayerBuilder();
    const groupLayerBuilder = new LayerBuilder();
    const itemTypesLayerBuilder = new LayerBuilder();
    const itemsLayerBuilder = new LayerBuilder();
    backgroundLayerBuilder.addElement(new Background(BACKGROUND_COLOR));
    groupLayerBuilder.addElement(
      new Rectangle(
        canvasSize,
        canvasSize,
        this.#firstCharUpperCase(groupName),
        styles.groupView.group
      ),
      0,
      0
    );
    Object.keys(this.#types).forEach((typePrefix, typeIndex) => {
      const padding = 10;
      const x = padding;
      const y = typeIndex * 300 + 100;
      const width = canvasSize - 2 * padding;
      const itemsPerRow = 4;
      const itemHeight = 30;
      const itemWidth = (width - padding * (itemsPerRow + 1)) / itemsPerRow;
      let items = domains[groupName][this.#types[typePrefix]];
      const height = items ?
        50 + Math.ceil(items.length / itemsPerRow) * (itemHeight + padding) :
        50;
      itemTypesLayerBuilder.addElement(
        new Rectangle(
          width,
          height,
          (this.#types[typePrefix] == "objects" ?
            "Data" :
            this.#firstCharUpperCase(this.#types[typePrefix])) +
          " " +
          icons[typePrefix],
          styles.groupView.itemType
        ),
        x,
        y
      );
      if (items) {
        items.forEach((item, itemIndex) => {
          itemsLayerBuilder.addElement(
            new Rectangle(
              itemWidth,
              itemHeight,
              item.slice(2, item.length),
              styles.groupView.item,
              false
            ),
            x +
            (((itemWidth + padding) * itemIndex + padding) %
              (width - padding)),
            y +
            50 +
            Math.floor(itemIndex / itemsPerRow) * (itemHeight + padding)
          );
        });
      }
    });
    return new MapBuilder()
      .addLayer(backgroundLayerBuilder.build())
      .addLayer(groupLayerBuilder.build())
      .addLayer(itemTypesLayerBuilder.build())
      .addLayer(itemsLayerBuilder.build())
      .build();
  }

  #getPixels(row, column, numOfRows, numOfColumns) {
    const x = (column * canvasSize) / 12;
    const y = (row * canvasSize) / 12;
    const width = (numOfColumns * canvasSize) / 12;
    const height = (numOfRows * canvasSize) / 12;
    return {
      x,
      y,
      width,
      height
    };
  }

  #firstCharUpperCase(string) {
    return string[0].toUpperCase() + string.slice(1, string.length);
  }
}