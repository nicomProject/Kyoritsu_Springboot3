$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        event: function () {
            const that = this
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

            $('.btn[role="action"][data-action="search"]').on('click', function() {
                that.performSearch();
            });
            $('#searchText').on('keydown', function(event) {
                if (event.key === 'Enter') {
                    that.performSearch();
                }
            });

            // 이거는 카테고리로 검색하는 API 만들어서 처리해야할듯.
            $('#category-total').on('click', function() {
                that.categorySearch("total");
            });
            $('#category-dormyinn').on('click', function() {
                that.categorySearch("dormyinn");
            });
            $('#category-resort').on('click', function() {
                that.categorySearch("resort");
            });

            AjaxUtil.request({
                method: 'GET',
                url: '/api/job/find',
                async: false,
                success: function (data) {
                    that.setJobObject(data.result.items)
                }
            });
        },
        categorySearch: function(search) {
            var that = this
            if (search == "" || search == undefined) {
                search = "total"
            }

            AjaxUtil.requestBody({
                url: '/api/job/findCategorySelf',
                data: {
                    category: search
                },
                success: function (data) {
                    console.log(data);
                    that.setJobObject(data.result.items);
                }
            });
        },
        performSearch: function(search) {
            var that = this;
            if (search == "" || search == undefined) {
                search = $('#searchText').val();
            }

            AjaxUtil.requestBody({
                url: '/api/job/search',
                data: {
                    title: search
                },
                success: function (data) {
                    console.log(data);
                    that.setJobObject(data.result.items);
                }
            });
        },
        setJobObject: function(jobs) {
            var newNoticeContainer = document.querySelector(".new-graduates.card-box");
            var careerNoticeContainer = document.querySelector(".mid-career.card-box");

            var newFirstChild = newNoticeContainer.firstElementChild
            newNoticeContainer.innerHTML = ''
            newNoticeContainer.appendChild(newFirstChild)

            var careerFirstChild = careerNoticeContainer.firstElementChild
            careerNoticeContainer.innerHTML = ''
            careerNoticeContainer.appendChild(careerFirstChild)
            
            jobs.forEach(item => {
                var jobObject = {}

                if (item.experience == "newcomer") {
                    jobObject.parentClass = ".new-graduates.card-box"
                    jobObject.experience = "신입"
                } else if (item.experience == "career") {
                    jobObject.parentClass = ".mid-career.card-box"
                    jobObject.experience = "경력"
                } else if (item.experience == "Synthesis") {
                    jobObject.parentClass = ".new-graduates.card-box"
                    jobObject.experience = "신입/경력"
                }

                if (item.category == "dormyinn") {
                    jobObject.title = "[" + "도미인" + "]"
                } else if (item.category == "resort") {
                    jobObject.title = "[" + "리조트" + "]"
                }
                jobObject.title += " " + item.title
                jobObject.date = item.fromDate.slice(0, 10) + "~" + item.toDate.slice(0, 10)

                this.createJob(jobObject)
            })
        },
        createJob: function(jobObject) {
            // 부모 요소 가져오기
            var noticeListContainer = document.querySelector(jobObject.parentClass);

            // 새로운 div 엘리먼트 생성
            var noticeItem = document.createElement('div');
            noticeItem.className = 'notice-item'; // 클래스 추가

            // 상위 레벨의 div 생성
            var topLineDiv = document.createElement('div');
            topLineDiv.className = 'top-line';

            // Career Category 생성
            var careerCategoryDiv = document.createElement('div');
            careerCategoryDiv.className = 'career-category';
            var careerCategorySpan = document.createElement('span');
            careerCategorySpan.textContent = jobObject.experience;
            careerCategoryDiv.appendChild(careerCategorySpan);

            // Career Title 생성
            var careerTitleDiv = document.createElement('div');
            careerTitleDiv.className = 'career-title';
            careerTitleDiv.textContent = jobObject.title

            // Top Line에 추가
            topLineDiv.appendChild(careerCategoryDiv);
            topLineDiv.appendChild(careerTitleDiv);

            // Bottom Line 생성
            var bottomLineDiv = document.createElement('div');
            bottomLineDiv.className = 'bottom-line';

            // 정규직, 상시모집 추가
            var regularDiv = document.createElement('div');
            regularDiv.textContent = '정규직';
            var recruitmentDiv = document.createElement('div');
            recruitmentDiv.textContent = jobObject.date;

            // Bottom Line에 추가
            bottomLineDiv.appendChild(regularDiv);
            bottomLineDiv.appendChild(recruitmentDiv);

            // 최종적으로 생성된 엘리먼트들을 조립
            noticeItem.appendChild(topLineDiv);
            noticeItem.appendChild(bottomLineDiv);

            // 공유 아이콘 추가
            var shareIconDiv = document.createElement('div');
            shareIconDiv.className = 'share-icon';
            var shareIcon = document.createElement('i');
            shareIcon.className = 'fas fa-solid fa-share';
            shareIconDiv.appendChild(shareIcon);

            // 새로운 div 엘리먼트 생성
            var dep1Div = document.createElement('div');
            dep1Div.appendChild(noticeItem)
            dep1Div.appendChild(shareIconDiv)

            // 새로운 div 엘리먼트 생성
            var noticeList = document.createElement('div');
            noticeList.className = "notice-list"
            noticeList.appendChild(dep1Div)

            // 부모 요소에 추가
            noticeListContainer.appendChild(noticeList);
        }
    }

    Content.load();
});