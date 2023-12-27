const Menu = {
    menus: [],
    subMenus: [],
    load: function (value) {
        let languageValue = value;
        const that = this;
        AjaxUtil.request({
            url: '/api/main/setting/menus',
            async: false,
            data: {
                languageValue: languageValue || "origin",
            },
            success: function (data) {
                const items = data.result.items;

                that.menus = items.filter(item => item.type === "group");
                that.subMenus = items.filter(item => item.type !== "group");

                console.log(that.subMenus)

                if(items[0].name){
                    languageValue = "kr"
                }else if(items[0].nameEnglish){
                    languageValue = "eng"
                }else{
                    languageValue = "jp"
                }

                $('#language-button').val(languageValue);

                /* 각 메뉴별 content 불러오기 */
                const submenu = Menu.subMenus;

                submenu.forEach(menu =>{
                    const path = menu.url;
                    const pathName = location.pathname;

                    const input = $('.param.contentId');

                    if(path == pathName && menu.content !== null){
                        const contentKey = menu.content.recKey;
                        input.val(contentKey);
                    }
                })

                that.draw(languageValue);
            },
        });
    },
    draw: function (languageValue) {
        const that = this;
        const container = $('#navbarSupportedContent .navbar-nav');
        container.html('');

        this.menus.forEach(menu => {
            const menuGroup = that.createMenuGroup(menu, languageValue);
            container.append(menuGroup);

            const subMenuContainer = menuGroup.find('.sub-menu');
            const subMenuItems = that.subMenus.filter(subMenu =>
                subMenu.menu.recKey === menu.recKey);

            subMenuItems.forEach(subMenu => {
                subMenuContainer.append(that.createSubMenuItem(subMenu, languageValue));
            });
        });
    },
    createMenuGroup: function (menu, languageValue) {
        const displayName = (languageValue === 'kr') ? menu.name : (languageValue === 'eng') ? menu.nameEnglish : menu.nameJapanese;
        return $(`<li class="nav-item col-12 col-md-3 mx-2">
                    <a class="nav-link" href="javascript:void(0)"
                        data-bs-toggle="collapse" data-bs-target="#submenu-${menu.recKey}-1"
                        aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation"> ${displayName}
                    </a>
                    <ul class="sub-menu collapse" id="submenu-${menu.recKey}-1">
                    </ul>
                </li>`);
    },
    createSubMenuItem: function (subMenu, languageValue) {
        const displayName = (languageValue === 'kr') ? subMenu.name : (languageValue === 'eng') ? subMenu.nameEnglish : subMenu.nameJapanese;
        const path = subMenu.url || '/';
        let activated = location.pathname ===  path ? 'active' : '';

        return $(`<li class="nav-item col-12 mx-2 ${activated}"><a href="${path}">${displayName}</a></li>`);
    },
};


$(function () {
    const Content = {
        load: function () {
            Menu.load();
            this.event();
        },
        event: function () {

            const languageButton = $('#language-button');

            // select 요소의 변경 이벤트 리스너 추가
            languageButton.on('change', function () {
                Menu.load($(this).val());
                window.location.reload();
            });

            const $body = $('body');
            const navbar = $('.navbar');

            navbar.find('.navbar-close').on({
                click: function (e) {
                    $body.removeClass('g-sidenav-pinned');
                }
            });
            navbar.find('.navbar-open').on({
                click: function (e) {
                    $body.addClass('g-sidenav-pinned');
                }
            });

            navbar.find('.sidenav-button').on({
                click: function (e) {
                    const icon = $(this).find('i');
                    icon.toggleClass('fa-compress');
                    icon.toggleClass('fa-thumbtack');
                    $body.toggleClass('g-sidenav-hidden');
                }
            })
        }
    }

    Content.load();
});