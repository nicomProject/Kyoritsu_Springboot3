$(function () {
    const Content = {
        load: function () {
            this.draw();
        },
        draw: function () {
            const footer = $('.footer');
            const items = footer.find('.footer-item:not([role="link"])');
            const link = footer.find('.footer-item[role="link"]')[0];

            if (link.ariaExpaned) {
                items.removeClass('hide');
            } else {
                link.innerHTML = '<i class="fas fa-unlink"></i>';
            }

            this.event();
        },
        event: function () {
            const footer = $('.footer');
            const items = footer.find('.footer-item:not([role="link"])');
            const link = footer.find('.footer-item[role="link"]');

            link.click(function (e) {
                items.removeClass('hide');

                if (this.ariaExpaned) {
                    items.css({opacity: 0});
                    this.innerHTML = '<i class="fas fa-unlink"></i>';
                    this.ariaExpaned = false;
                } else {
                    items.css({opacity: 1});
                    this.innerHTML = '<i class="fas fa-link"></i>';
                    this.ariaExpaned = true;
                }

            })
        }
    };

    Content.load();
});