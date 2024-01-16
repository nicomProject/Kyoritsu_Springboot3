let detailPageName; // 현재 페이지가 detail 페이지인지 여부(detail페이지 : 페이지명, not detail페이지 : '')

const Menu = {
    menus: [],
    subMenus: [],
    languageVal: null,
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
                    that.languageVal = "kr"
                }else if(items[0].nameEnglish){
                    languageValue = "eng"
                    that.languageVal = "eng"
                }else{
                    languageValue = "jp"
                    that.languageVal = "jp"
                }

                $('#language-button').val(languageValue);
                detailPageName = $('#detail_page_name').val() || '';

                console.log(detailPageName);

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
        // 상단 헤더 메뉴 컨테이너
        const container = $('#navbarSupportedContent .navbar-nav');
        container.html('');

        // 상단 페이지 타이틀
        const container_breadcrumbs_title = $('#breadcrumbs-title .breadcrumbs-content')
        container_breadcrumbs_title.html('');

        // 중단 메뉴 버튼 컨테이너
        const container_breadcrumbs_content = $('#breadcrumbs-content .breadcrumbs-content')
        container_breadcrumbs_content.html('');

        // 우측 상단 네비게이션 컨테이너
        const container_breadcrumbs_nav = $('#breadcrumbs-nav .breadcrumb-nav')
        container_breadcrumbs_nav.html('');

        // 중단 메뉴 버튼 ID 설정
        const btnIdAboutUs = ['btnOverview','btnVision','btnHistory','btnOrganization','btnLocation']; // 회사소개 버튼
        const btnIdRecruit = ['btnEmployeeInfo','btnInfo','btnNotice','btnApply','btnInquire']; // 채용정보 버튼

        // 메뉴 그룹 리스트 가지고 값 제작
        this.menus.forEach(menu => {
            // 상단 헤더 메뉴그룹 제작
            const menuGroup = that.createMenuGroup(menu, languageValue);
            container.append(menuGroup);

            // menuGroup 메뉴이름 추가
            if(document.getElementById('page_group_id') != null) {
                var pageGroupIdVal = document.getElementById('page_group_id').value;
                if(menu.recKey == 1 && pageGroupIdVal == 'about_us') {
                    // (회사소개)
                    const menuGroupName = that.createMenuGroupName(menu, languageValue);
                    container_breadcrumbs_title.append(menuGroupName);
                } if(menu.recKey == 2 && pageGroupIdVal == 'business_area') {
                    // (사업영역)
                    const menuGroupName = that.createMenuGroupName(menu, languageValue);
                    container_breadcrumbs_title.append(menuGroupName);
                } if(menu.recKey == 3 && pageGroupIdVal == 'news') {
                    // (공지사항)
                    const menuGroupName = that.createMenuGroupName(menu, languageValue);
                    container_breadcrumbs_title.append(menuGroupName);
                } if(menu.recKey == 4 && pageGroupIdVal == 'recruit') {
                    // (채용정보)
                    const menuGroupName = that.createMenuGroupName(menu, languageValue);
                    container_breadcrumbs_title.append(menuGroupName);
                }
            }

            // 현재 메뉴그룹에 해당하는 하위 메뉴 추출
            const subMenuContainer = menuGroup.find('.sub-menu');
            const subMenuItems = that.subMenus.filter(subMenu =>
                subMenu.menu.recKey === menu.recKey);

            // 하위 메뉴 리스트 가지고 값 제작
            subMenuItems.forEach((subMenu,index) => {
                // 1. 회사소개
                if(menu.recKey == 1 && pageGroupIdVal == 'about_us') {
                    // breadcrumbs-content 메뉴 추가
                    const breadcrumbsMenu = that.createBreadcrumbsMenu(subMenu, btnIdAboutUs[index], languageValue);
                    container_breadcrumbs_content.append(breadcrumbsMenu);

                    // breadcrumbs-nav 추가 
                    if(document.getElementById('page_id') != null) {
                        var pageIdVal = document.getElementById('page_id').value;
                        if(index == 0 && pageIdVal == 'overview') {
                            // (기업개요)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 1 && pageIdVal == 'vision') {
                            // (경영이념/비전)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 2 && pageIdVal == 'history') {
                            // (연혁)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 3 && pageIdVal == 'organization') {
                            // (조직도)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 4 && pageIdVal == 'location') {
                            // (오시는 길)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        }
                    }
                }
                // 2. 사업영역
                if(menu.recKey == 2 && pageGroupIdVal == 'business_area') {
                    // breadcrumbs-nav 추가 
                    if(document.getElementById('page_id') != null) {
                        var pageIdVal = document.getElementById('page_id').value;
                        if(index == 0 && pageIdVal == 'dormyinn') {
                            // (도미인)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        }
                    }
                }
                // 3. 공지사항
                if(menu.recKey == 3 && pageGroupIdVal == 'news') {
                    // breadcrumbs-nav 추가 
                    if(document.getElementById('page_id') != null) {
                        var pageIdVal = document.getElementById('page_id').value;
                        if(index == 0 && pageIdVal == 'notice') {
                            // (공지사항)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        }
                    }
                }
                // 4. 채용정보
                if(menu.recKey == 4 && pageGroupIdVal == 'recruit') {
                    // breadcrumbs-content 메뉴 추가
                    const breadcrumbsMenu = that.createBreadcrumbsMenu(subMenu, btnIdRecruit[index], languageValue);
                    container_breadcrumbs_content.append(breadcrumbsMenu);

                    // breadcrumbs-nav 추가 
                    if(document.getElementById('page_id') != null) {
                        var pageIdVal = document.getElementById('page_id').value;
                        if(index == 0 && pageIdVal == 'employee_info') {
                            // (직원소개)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 1 && pageIdVal == 'info') {
                            // (채용안내)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 2 && pageIdVal == 'notice') {
                            // (채용공고)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 3 && pageIdVal == 'apply') {
                            // (채용지원)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        } if(index == 4 && pageIdVal == 'inquire') {
                            // (채용문의)
                            const breadcrumbsNav = that.createBreadcrumbsNav(menu, subMenu, languageValue, detailPageName);
                            container_breadcrumbs_nav.append(breadcrumbsNav);
                        }
                    }
                }
                // 메인 헤더 하위 메뉴 추가
                subMenuContainer.append(that.createSubMenuItem(subMenu, languageValue));
            });
        });

    },
    createBreadcrumbsNav: function (menu, subMenu, languageValue, detailPageName) {
        const displayNameMenu = (languageValue === 'kr') ? menu.name : (languageValue === 'eng') ? menu.nameEnglish : menu.nameJapanese;
        const displayNameSubMenu = (languageValue === 'kr') ? subMenu.name : (languageValue === 'eng') ? subMenu.nameEnglish : subMenu.nameJapanese;
        if(detailPageName === 'recruit_apply') return $(`<li><a href="/">Home</a></li><li><a href="../notice">${displayNameMenu}</a></li><li>${displayNameSubMenu}</li>`);      // 채용지원 페이지 (지원서 작성)
        else if(detailPageName === 'inquire_add') return $(`<li><a href="/">Home</a></li><li><a href="../inquire">${displayNameMenu}</a></li><li>${displayNameSubMenu}</li>`);   // 채용문의 작성 페이지
        else if(detailPageName !== '') return $(`<li><a href="/">Home</a></li><li><a href="../../${detailPageName}">${displayNameMenu}</a></li><li>${displayNameSubMenu}</li>`);// 이외에 상세 페이지
        else return $(`<li><a href="/">Home</a></li><li><a href="">${displayNameMenu}</a></li><li>${displayNameSubMenu}</li>`);
    },
    createMenuGroupName: function (menu, languageValue) {
        const displayName = (languageValue === 'kr') ? menu.name : (languageValue === 'eng') ? menu.nameEnglish : menu.nameJapanese;
        return $(`<h1 class="page-title">${displayName}</h1><p>Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business .</p>`);
    },
    createBreadcrumbsMenu: function (menu, btnId, languageValue) {
        const displayName = (languageValue === 'kr') ? menu.name : (languageValue === 'eng') ? menu.nameEnglish : menu.nameJapanese;
        return $(`<button type="button"  class="navbar-toggler" id="${btnId}">${displayName}</button>`);
    },
    createMenuGroup: function (menu, languageValue) {
        const displayName = (languageValue === 'kr') ? menu.name : (languageValue === 'eng') ? menu.nameEnglish : menu.nameJapanese;
        return $(`<li class="nav-item" style="position: relative;">
            <a class="nav-link" href="javascript:void(0)"
                data-bs-toggle="collapse" data-bs-target="#submenu-${menu.recKey}-1"
                aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation"> 
                <i class="your-icon-class"></i> ${displayName}
            </a>
            <ul class="sub-menu collapse" id="submenu-${menu.recKey}-1" style="width: 100%; position: absolute; left: 50%; transform: translateX(-50%);">
            </ul>
        </li>`);

    },
    createSubMenuItem: function (subMenu, languageValue) {
        const displayName = (languageValue === 'kr') ? subMenu.name : (languageValue === 'eng') ? subMenu.nameEnglish : subMenu.nameJapanese;
        const path = subMenu.url || '/';
        let activated = location.pathname === path ? 'active' : '';

        return $(`<li class="nav-item col-12 mx-0 ${activated} nav-item-custom"><a href="${path}">${displayName}</a></li>`);
    },

};


$(function () {
    const Content = {
        load: function () {
            Menu.load();
            this.event();
        },
        event: function () {

            const contactButton = $('.button');
            const languageButton = $('#language-button');

            contactButton.on('click', function (){
                popup();
            })



            function popup() {
                var newWindowWidth;
                var newWindowHeight;
                if(Menu.languageVal === "kr"){
                    newWindowWidth = 570;
                    newWindowHeight = 350;
                }else if(Menu.languageVal === "eng")
                {
                    newWindowWidth = 920;
                    newWindowHeight = 360;
                }else if(Menu.languageVal === "jp")
                {
                    newWindowWidth = 845;
                    newWindowHeight = 360;
                }


                var newWindow = window.open('/index_popup', 'Contact', 'width=' + newWindowWidth + ',height=' + newWindowHeight + ',top=' + "100" +  ',location=no');

                if (!newWindow) {
                    alert('팝업이 차단되었습니다. 팝업을 허용해주세요.');
                }
            }

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