$(function () {
    const Content = {
        menus: [],
        subMenus: [],
        load: function () {
            const that = this;
            let menu_items = [];
            let submenu_items = [];
            let languageValue = Menu.languageVal;
            this.menus = Menu.menus
            this.subMenus = Menu.subMenus;
            

            console.log(languageValue);

            Object.keys(this.menus).forEach(key => {
                var menuItems;
                if(languageValue == 'kr') {
                    menuItems = {recKey: this.menus[key].recKey, name: this.menus[key].name, url: this.menus[key].url}
                } else if(languageValue == 'eng') {
                    menuItems = {recKey: this.menus[key].recKey, name: this.menus[key].nameEnglish, url: this.menus[key].url}
                } else if(languageValue == 'jp') {
                    menuItems = {recKey: this.menus[key].recKey, name: this.menus[key].nameJapanese, url: this.menus[key].url}
                }
                menu_items.push(menuItems);
            });

            Object.keys(this.subMenus).forEach(key => {
                var submenuItems;
                if(languageValue == 'kr') {
                    submenuItems = {recKey: this.subMenus[key].menu.recKey, name: this.subMenus[key].name, url: this.subMenus[key].url}
                } else if(languageValue == 'eng') {
                    submenuItems = {recKey: this.subMenus[key].menu.recKey, name: this.subMenus[key].nameEnglish, url: this.subMenus[key].url}
                } else if(languageValue == 'jp') {
                    submenuItems = {recKey: this.subMenus[key].menu.recKey, name: this.subMenus[key].nameJapanese, url: this.subMenus[key].url}
                }
                submenu_items.push(submenuItems);
            });

            const container = $('.single-footer.f-contact.f-link');
            container.html('');

            const menuGroup = that.createMenuGroup(menu_items, submenu_items);
            container.append(menuGroup);

            this.draw()

        },
        draw: function () {

            this.event();
        },
        event: function () {
        },
        createMenuGroup: function (menuItems, submenuItems) {
            const menuGroup = $('.single-footer.f-contact.f-link');

            menuItems.forEach(menuItem => {
                const menuList = $('<ul class="footer_menu"></ul>');
                const menuLink = $(`
                <li>
                <a>${menuItem.name}</a>
                </li>
        `);

                menuList.append(menuLink);
                submenuItems.forEach(submenuItem => {
                    if (submenuItem.recKey === menuItem.recKey) {
                        const submenuLi = $(`
                    <li>
                    <a href=${submenuItem.url}>${submenuItem.name}</a>
                    </li>
                `);
                        menuList.append(submenuLi);
                    }
                });

                menuGroup.append(menuList);
            });

            return menuGroup;
        },
    }

    Content.load();
});