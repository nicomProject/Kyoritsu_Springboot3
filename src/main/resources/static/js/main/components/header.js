const Menu = {
    menus: [],
    subMenus: [],
    load: function () {
        const that = this;
        AjaxUtil.request({
            url: '/api/main/setting/menus',
            async: false,
            success: function (data) {
                const items = data.result.items;
                that.menus = items.filter(item => item.type === "group");
                that.subMenus = items.filter(item => item.type !== "group");

                /* 각 메뉴별 content 불러오기 */
                const submenu = Menu.subMenus;

                submenu.forEach(menu =>{
                    const path = menu.url;
                    const pathName = location.pathname;

                    const input = $('.param.contentId');

                    if(path == pathName){
                        // const contentKey = menu.content.recKey;
                        const contentKey = menu.recKey; // fix : menu.content가 없음. 바로 recKey를 가져와야 함. (PageVO의 field인 item의 type 변경으로 인함)
                        input.val(contentKey);
                    }
                })

                that.draw();
            },
        });
    },
    draw: function () {
        const that = this;
        const container = $('#navbarSupportedContent .navbar-nav');
        container.html('');

        this.menus.forEach(menu => {
            const menuGroup = that.createMenuGroup(menu);
            container.append(menuGroup);

            const subMenuContainer = menuGroup.find('.sub-menu');
            const subMenuItems = that.subMenus.filter(subMenu => subMenu.menu.recKey === menu.recKey);

            subMenuItems.forEach(subMenu => {
                subMenuContainer.append(that.createSubMenuItem(subMenu));
            });
        });
    },
    createMenuGroup: function (menu) {

        return $(`<li class="nav-item col-12 col-md-3 mx-2">
                    <a class="nav-link" href="javascript:void(0)"
                        data-bs-toggle="collapse" data-bs-target="#submenu-${menu.recKey}-1"
                        aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation"> ${menu.name}
                    </a>
                    <ul class="sub-menu collapse" id="submenu-${menu.recKey}-1">
                    </ul>
                </li>`);
    },
    createSubMenuItem: function (subMenu) {
        const path = subMenu.url || '/';
        let activated = location.pathname ===  path ? 'active' : '';

        return $(`<li class="nav-item col-12 mx-2 ${activated}"><a href="${path}">${subMenu.name}</a></li>`);
    },
};

// 메인 메뉴를 구성
$(function () {
    const Content = {
        load: function () {
            Menu.load();
            this.event();
        },
        event: function () {

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