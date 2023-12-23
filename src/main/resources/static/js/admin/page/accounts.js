$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;

            Data.load({allRole: true});
            this.event();
        },
        event: function () {
            const card = $('.card')
            const table = Table.load('#table');

            card.find('*[role="action"]').click(function (e) {
                const action = this.dataset.action;

                // 관리자 등록
                if (action === 'add') {
                    window.location.href = '/admin/account/detail'                }
                // 관리자 초기화
                else if (action === 'reset') {
                    const selected = table.getSelectedData().map(e => e.userId);
                    if(selected.length === 0){
                        Alert.warning({
                            title: '관리자 초기화',
                            text: '초기화하실 관리자를 선택해주세요!'
                        });
                    }
                    else if (selected.includes(memberInfo.id)) {
                        Alert.warning({
                            title: '관리자 초기화',
                            text: '현재 로그인한 계정이 포함되어 있습니다.<br>이를 제외하고 다시 진행해주세요!'
                        });
                    } else {
                        Alert.confirm({
                            title: '관리자 초기화',
                            text: '선택하신 관리자를 초기화하시겠습니까?<br>선택된 관리자: ' + selected.join(',')
                        }, function (result) {
                            if (!result.isConfirmed) return;

                            AjaxUtil.requestBody({
                                url: '/api/manager/init',
                                data: {
                                    type: 'list',
                                    idList: selected
                                },
                                table: 'table',
                                successMessage: '성공적으로 초기화되었습니다.'
                            });
                        });
                    }
                }
                // 초기 비밀번호 설정
                else if (action === 'setInitPwd') {
                    let val = '';
                    AjaxUtil.request({
                        method: 'GET',
                        url: '/api/adm/setting/initpwd',
                        async: false,
                        success: function (data) {
                            val = data.result.info.value1;
                        }
                    });

                    Swal.fire({
                        title: '초기 비밀번호 설정',
                        html: `현재 초기 비밀번호는 '<b>${val}</b>'입니다.<br>변경하실 초기 비밀번호를 입력해주십시오`,
                        icon: 'info',
                        input: 'password',
                        inputAttributes: {
                            autocapitalize: 'off',
                            autocomplete: 'new-password'
                        },
                        customClass: {
                            confirmButton: `btn btn-info`,
                            cancelButton: `btn btn-secondary`
                        },
                        showCancelButton: true,
                        confirmButtonText: '변경',
                        cancelButtonText: '취소',
                        showLoaderOnConfirm: true,
                        preConfirm: (pwd) => {
                            if (pwd === '') {
                                Swal.showValidationMessage('비밀번호를 입력해주세요!');
                            } else if (pwd === val) {
                                Swal.showValidationMessage('기존과 다른 비밀번호를 입력해주세요!');
                            } else {
                                const validation = ValidationUtil.checkPasswordPattern(pwd);
                                if(!validation.result){
                                    Swal.showValidationMessage(validation.error);
                                }
                            }
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                    }).then((result) => {
                        if (!result.isConfirmed) return;

                        const value = result.value;
                        Alert.confirm({title: '비밀번호 확인', text: `<b>"${value}"</b>로 변경하시겠습니까?`}, function (result) {
                            if (result.isConfirmed) {
                                AjaxUtil.requestBody({
                                    url: '/api/adm/setting/initpwd',
                                    data: {
                                        value: value
                                    },
                                    successMessage: '성공적으로 변경되었습니다.'
                                });
                            }
                        });
                    });
                }
            });
        }
    };

    const Table = {
        table: null,
        load: function (target) {
            return this.draw(target);
        },
        draw: function (target) {
            const that = this;

            const roleHash = Data.allRoleHash || {};
            const table = new Tabulator(target, {
                locale: 'ko-kr',
                langs: TableUtil.setDefaults(),
                layout: 'fitColumns',
                placeholder: TableUtil.getPlaceholder('조건에 맞는 관리자가 없습니다.'),
                headerFilterPlaceholder: '검색어 입력',
                pagination: false,
                paginationSize: paginationConfig.size,
                paginationSizeSelector: paginationConfig.selector,
                ajaxLoaderLoading: TableUtil.getLoaderLoading(),
                ajaxURL: Content.params.url,
                ajaxConfig: ajaxConfig,
                dataReceiveParams: {
                    "last_page": "lastPage",
                    "data": "items"
                },
                ajaxResponse: function (url, params, response) {
                    if (AjaxUtil.errorHandling(response)) {
                        return [];
                    }
                    response = response.result;
                    return response.items;
                },
                ajaxError: TableUtil.ajaxError,
                columnHeaderVertAlign: "middle",
                columns: [
                    {
                        formatter: "rowSelection",
                        titleFormatter: "rowSelection",
                        titleFormatterParams: {rowRange: "active"},
                        hozAlign: "center",
                        vertAlign: 'middle',
                        widthGrow: 0.5,
                        headerHozAlign: "center",
                        cellClick: function (e, cell) {
                            cell._cell.row.component.toggleSelect();
                        },
                        width: 30,
                        download: false,
                        headerSort: false
                    },
                    {
                        title: "NO",
                        formatter: "rownum",
                        hozAlign: "center",
                        headerHozAlign: "center",
                        width: 70,
                        download: false,
                        headerSort: false
                    },
                    {title: '아이디', field: "userId", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {title: '이름', field: "name", tooltip: true, headerTooltip: true, headerFilter: 'input'},
                    {
                        title: '권한',
                        field: "role",
                        headerSort: false,
                        tooltip: true,
                        headerTooltip: true,
                        headerFilter: "list",
                        headerFilterParams: {values: roleHash},
                        formatter: function (cell) {
                            let content = roleHash[cell.getValue()] || cell.getValue();
                            return `<span class="badge badge-default">${content}</span>`;
                        }
                    },
                    {
                        title: '활성여부',
                        field: "enable",
                        vertAlign: 'middle',
                        hozAlign: 'center',
                        headerHozAlign: 'center',
                        headerSort: false,
                        headerTooltip: () => {
                            return '관리자 로그인 가능여부를 나타냅니다.<br>로그인 시도횟수 5회 초과시 로그인이 정지됩니다';
                        },
                        formatter: function (cell) {
                            const data = cell.getRow().getData();
                            let element = IconUtil.enable
                            if (cell.getValue() === 0 || data.failureCnt && data.failureCnt > 5) {
                                element = IconUtil.disable;
                            }
                            return element
                        }
                    },
                    {
                        title: '로그인<br>시도 횟수',
                        field: "failureCnt",
                        hozAlign: 'center',
                        tooltip: true,
                        headerTooltip: true
                    },
                    {
                        title: '<i class="fas fa-clock"></i> 로그인 일시',
                        field: "loginDate",
                        tooltip: true,
                        headerTooltip: true
                    },
                    {
                        title: '<i class="fas fa-clock"></i> 수정 일시',
                        field: "editDate",
                        tooltip: true,
                        headerTooltip: true
                    },
                ],
            });

            const events = {
                rowClick: function (e, row) {
                    window.location.href = '/admin/account/detail/' + row.getData().recKey;
                },
                downloadComplete: function () {
                    Swal.close();
                },
                cellMouseEnter: function (e, cell, row) {
                    TableUtil.cellMouseEnter(e, cell, row)
                },
                ajaxError: TableUtil.ajaxError,
            };

            Object.entries(events).forEach(([event, callback]) => {
                table.on(event, callback);
            });

            this.table = table;
            return table;
        },
    };

    Content.load({
        url: "/api/managers"
    });
})