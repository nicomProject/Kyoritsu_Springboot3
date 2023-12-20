$(function () {
    const Content = {
        params: {},
        mappings: [],
        load: function (params) {
            const that = this;
            this.params = params;

            AjaxUtil.request({
                url: '/api/list',
                success: function (data) {
                    that.mappings = data.result.items;
                    that.draw();
                }
            });
        },
        draw: function () {
            const methods = $('#methods');

            let contents = '';
            let index = 0;

            const mappings = this.mappings;
            mappings.forEach(method => {
                const formActive = true;
                let form = formActive ? `
					<div class="form mt-2" id="form-${index}">
						<div class="form-group">
							${ArrUtil.createInputWithArr(method.required, index, true)}
							${ArrUtil.createInputWithArr(method.column, index, false)}
							<div class="btn-group">
								<button class="btn btn-primary mr-1" role="action" data-action="test" data-form="form-${index}" data-path="${method.path}" data-body="${method.body}">테스트</button>
								<button class="btn btn-danger bg-danger" data-form="form-${index}" role="action" data-action="reset">초기화</button>
							</div>
						</div>
						<div class="form-test"></div>
					</div>
				` : ``;

                const requestBody = method.RequestBody ? `
                    <span class="badge rounded-pill bg-gradient-secondary" role="tips" data-action="requestBody"><i class="fas fa-file-archive"></i></span>
                ` : '';

                contents += `
					<div class="accordion-item">
						<h2 class="accordion-header" id="panels${index}">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
								data-bs-target="#panelsPanel${index}" aria-expanded="false" aria-controls="panelsPanel${index}">
								<span>
                                    ${ArrUtil.createStrBadgeWithArr(method.method, 'bg-secondary')}
								    ${requestBody}
								</span>
								<span class="ms-1">${method.path}</span>
							</button>
						</div>
						<div id="panelsPanel${index}" class="accordion-collapse collapse" aria-labelledby="panels${index}">
							<div class="accordion-body">
								<div class="display-flex">
									<span class="badge bg-light text-dark">설명</span>
									<span class="badge bg-primary rounded-pill ellipsis">${method.desc}</span>
								</div>
								<div>
									<span class="badge bg-light text-dark">필수 파라미터</span>
									<span>${ArrUtil.createStrBadgeWithArr(method.required, 'bg-secondary')}</span>
								</div>
								<div>
									<span class="badge bg-light text-dark">추가 파라미터</span>
									<span>${ArrUtil.createStrBadgeWithArr(method.column, 'bg-secondary')}</span>
								</div>
								${form}
							</div>
						</div>
					</div>
				`;
                index += 1;
            });

            methods.html(contents);

            this.event();
        },
        event: function () {
            const methods = $('#methods');

            tippy('span[role="tips"][data-action="requestBody"]', {
                content: `API 요청시 HTTP Request Body 구문에 JSON 형식으로 파라미터를 추가해야합니다.<br><br>파라미터가 없을 경우 Empty Body ({}) 를 추가해주세요.`,
                allowHTML: true
            })

            /**
             * Action Button
             * 1. test
             * 2. reset
             */
            methods.find('.btn[role="action"]').click(function (e) {
                const that = this;

                const action = this.dataset.action;
                const formID = this.dataset.form;
                const path = this.dataset.path;
                const url = this.dataset.path;
                const body = this.dataset.body;

                const inputCon = $(`#${formID} .form-group`);
                const logger = $(`#${formID} .form-test`);
                if (['/api', '/api/connect'].indexOf(path) > -1) {
                    logger.css({maxHeight: inputCon.height()});
                } else {
                    logger.css({maxHeight: '500px'});
                }

                if (action === "test") {
                    const params = {};

                    that.disabled = true;

                    const columnsForParse = ["barcodes"]
                    const inputs = $(`#${formID} .form-control`);
                    inputs.each(function () {
                        if (this.value != '') {
                            params[this.name] = this.value
                        }
                        if (columnsForParse.includes(this.name)) {
                            params[this.name] = JSON.parse(this.value)
                        }
                    });

                    const options = {
                        url: url,
                        alert: false,
                        data: params,
                        success: function (data) {
                            that.disabled = false;

                            let color = parseInt(data.code / 100) === 2 ? 'text-success' : 'text-danger';
                            logger.html(`
								<div class="text-log text-secondary">
									Request Path: ${url}?${TableUtil.parseParam(params)}
								</div> 
							`);

                            logger.append(`
								<div class="text-log ${color}">
									${JSON.stringify(data)}
								</div>
							`);
                        }
                    };

                    if (body === 'true') {
                        AjaxUtil.requestBody(options, true, logger);
                    } else {
                        AjaxUtil.request(options, true, logger);
                    }
                } else if (action === "reset") {
                    logger.html('');
                    $(this).parent().find('.btn').prop('disabled', false);
                }
            });
        }
    }

    Content.load();
});
