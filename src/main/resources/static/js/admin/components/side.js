const SideBar = {
    menus: [],
    load: function () {
        const that = this;
        AjaxUtil.request({
            url: '/api/adm/setting/menus',
            async: false,
            success: function (data) {
                that.menus = data.result.items;
                that.draw();

                setTimeout(function(){
                    that.event();
                }, 100)
            }
        });
    },
    draw: function () {
        const that = this;
        const container = $('.navbar.sidenav .navbar-nav');
        container.html('');

        const groups = this.menus.map(e => e.group);
        const groupHash = {};
        groups.forEach(function(e){
            console.log(e)
            groupHash[e.code] = e;
        });

        console.log(groupHash)

        Object.entries(groupHash).forEach(([code, group]) => {
            container.append(that.createMenuGroup(group))
        })
        this.menus.forEach(menu => {
            container.find(`#collpase-${menu.group.code}`).append(that.createMenuItem(menu))
        });
    },
    event: function(){
        const container = $('.navbar.sidenav .navbar-nav');
        container.find('.nav-link.active').parents('.nav-group').collapse('show');
    },
    createMenuGroup: function(group){
        return `<li class="nav-item" data-bs-toggle="collapse" data-bs-target="#collpase-${group.code}" role="button" aria-expanded="false" aria-controls="#collpase-${group.code}">
                    <a class="nav-link">
                        <div class="icon icon-shape icon-sm">
                            <i class="fas fa-folder"></i>
                        </div>
                        <span class="nav-link-text ms-2">${group.name}</span>
                    </a>
                </li>
                <div class="collapse nav-group" id="collpase-${group.code}">
                </div>`
    },
    createMenuItem: function (menu) {
        let path = menu.url || '/';
        let activated = location.pathname === menu.url ? 'active' : '';
        if (menu.code === 'introductions' && location.pathname === '/admin') {
            path = '/admin';
            activated = 'active';
        }

        return `<li class="nav-item">
                    <a class="nav-link ${activated}" href="${path}">
                        <div class="icon icon-shape icon-sm">
                            <i class="${menu.icon}"></i>
                        </div>
                        <span class="nav-link-text ms-2">${menu.name}</span>
                    </a>
                </li>`;
    }
};

$(function () {
    const Content = {
        load: function () {
            SideBar.load();

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

            tippy('*[role="action"][data-action="shield"]', {
                content: '비밀번호 변경'
            });
            tippy('*[role="action"][data-action="logout"]', {
                content: '로그아웃'
            });

            navbar.find('*[role="action"]').click(function (e) {
                const action = this.dataset.action;
                if (action === 'logout') {
                    Alert.confirm({
                        title: '로그아웃',
                        text: '로그아웃 하시겠습니까?',
                    }, function (result) {
                        if (result.isConfirmed) {
                            location.href = '/admin/logout';
                        }
                    });
                } else if (action === 'shield') {
                    ParamManager.show('password', 'password', {});
                }
            });
        }
    }

    Content.load();
});