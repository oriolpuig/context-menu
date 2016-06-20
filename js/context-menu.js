$(function () {
    var context_menu = $(".context-menu");
    var input_result = $("#result");

    function updatePositions(mouseX, mouseY, $contextMenu) {
        var page_width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var page_height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        page_width += $(window).scrollLeft();
        page_height += $(window).scrollTop();

        // Update main context-menu

        // Default positions
        context_menu.css({ left: mouseX });
        context_menu.css({ top: mouseY });

        // Default info
        var context_info = context_menu.offset();
        context_info.width = context_menu.width();
        context_info.height = context_menu.height();

        // Def new vars if needed
        var newX = (mouseX - context_info.width) + 'px';
        var newY = (mouseY - context_info.height) + 'px';

        // Update X position
        if (page_width < context_info.left + context_info.width) {
            context_menu.css({ left: newX });
        }

        // Update Y position
        if (page_height < context_info.top + context_info.height) {
            context_menu.css({ top: newY });
        }

        // Update submenus
        context_menu.find('li.parent')
            // Mouse Enter
            .off('mouseenter.jq').on('mouseenter.jq', function () {
                var $liWithSubmenu = $(this),
                    $wrapperParent = $('> .context-wrapper', $liWithSubmenu);

                var menuItemPos = $liWithSubmenu.position();

                $wrapperParent.css({
                    top: menuItemPos.top,
                    left: menuItemPos.left + Math.round($liWithSubmenu.outerWidth())
                });

                var ul = $($wrapperParent).find(' > ul');
                if (!ul.length) return;

                // Default info
                var ul_info = ul.offset();
                ul_info.width = ul.width();
                ul_info.height = ul.height();

                // Update X position
                if (page_width < ul_info.left + ul_info.width) {
                    $wrapperParent.css({ left: 'auto', right: '99%' });
                }
                // Update Y position
                if (page_height < ul_info.top + ul_info.height) {
                    $wrapperParent.css({ top: 'auto', bottom: '0' });
                }
            })
            // Mouse Leave
            .off('mouseleave.jq').on('mouseleave.jq', function () {
                var $liWithSubmenu = $(this),
                    $wrapperParent = $('> .context-wrapper', $liWithSubmenu);

                $wrapperParent.removeAttr("style");

                var ul = $($wrapperParent).find(' > ul');
                ul.removeAttr("style");
            });
    }

    function render(data, event) {
        // Get the element who open context-menu
        var element = document.elementFromPoint(event.pageX, event.pageY);

        if (!$) { console.error("No jQuery defined."); }

        // Put clas context to the 'element' who launch the context-menu
        $(event.currentTarget).addClass('context');

        // Build context-menu
        var $contextMenu = $('<div>');
        $contextMenu.addClass('clearfix context-menu');

        // Build wrapper
        var $wrapper = $('<div>');
        $wrapper.addClass('context-wrapper');

        // Build <ul>
        var $ul = $('<ul>');

        // Get cursor position.
        var x = event.pageX - $(window).scrollLeft();
        var y = event.pageY - $(window).scrollTop();

        // Add options to the <ul>
        data.forEach(function (item, i) {
            buildMenuItem($, $ul, item, event.pageX, element);
        }, this);

        // Append HTMLs
        $wrapper.append($ul);
        $contextMenu.append($wrapper);
        $(document).find('body').append($contextMenu);
        context_menu = $(".context-menu");

        // Set default position and put in the correct position.
        $contextMenu.css({ left: x, top: y }).show();
        updatePositions(x, y, $contextMenu);

        // Events to remove context-menu. 
        $contextMenu.on("click", function (e) {
            $(event.currentTarget).removeClass('context');
            $contextMenu.remove();
        }).on('contextmenu', function (event) {
            $(event.currentTarget).removeClass('context');
            event.preventDefault();
            $contextMenu.remove();
        });
    }

    function buildMenuItem($, $ul, item, x, element) {
        // Build LI per each option
        var $li = $('<li>');

        // Divider
        if (item === null) {
            $li.addClass('divider');
        }
        // Option with childs
        else if (item[1] instanceof Array) {
            // sub-menu
            $li.addClass("parent");

            // Build $wrapper.
            var $wrapper = $('<div>');
            $wrapper.addClass('context-wrapper');

            // Build sub-menu
            var $subMenu = $('<ul>');

            // Print list of child options
            item[1].forEach(function (subItem, x) {
                buildMenuItem($, $subMenu, subItem);
            });

            $a = $('<a>');
            $a.text(item[0]);
            $li.append($a);

            if (x + 340 > $(window).width()) $subMenu.left = (x - 162) + "px";

            // Append HTML.
            $wrapper.append($subMenu);
            $li.append($wrapper);
        }
        // Normal Item
        else {
            // Normal item
            $a = $('<a>');
            $a.attr({ tabindex: '-1', href: '#', 'class': 'context-angular' });
            $a.text(item[0]);
            $li.append($a);

            // Show alert with the value. 
            $li.on('click', function (e) {
                // Change that action to whatever you want.
                if (typeof item[1] === "string") {
                    if (input_result.length > 0) {
                        input_result.val(item[1]);

                        // highlight the result input.
                        $(input_result).effect("highlight", { color: '#5cb85c' }, 2000);
                    }
                }
            });
        }

        // Add item-list to the UL.
        $ul.append($li);
    }

    function removeCurrentContextMenu(e) {
        if ($('.context-menu') !== undefined) {
            $('.context-menu').remove();
        }
    }

    /**
     * Show menu when the right mouse button is clicked
     */
    window.oncontextmenu = function (e) {
        e.preventDefault();

        var data = generateContextMenuData();
        if (data !== undefined && data !== null && data instanceof Array) {
            var x = e.pageX - $(window).scrollLeft();
            var y = e.pageY - $(window).scrollTop();

            render(data, e);
        }

        return false;
    };

    /**
     * Hide menu when the right mouse button is clicked
     */
    $(document).click(function () {
        setTimeout(function () {
            removeCurrentContextMenu();
        }, 50);
    });

    // $('input[name=myInput]').change(function() { ... });
    function generateContextMenuData() {
        var data = [];

        data.push(["Few Options", generateChildByString("Add")]);
        data.push(["Many Options", generateChildByString("Edit", 100)]);
        data.push(["Child Options", generateChildByString("Options", 10, true)]);
        data.push(null);
        data.push(["Without Childs", "Without Childs"]);

        return data;
    }

    function generateChildByString(str = "", num = 5, hasChild = false) {
        var childs = [];

        for (var i = 0; i < num; i++) {
            var child = null;
            if (hasChild && (i % 2)) {
                child = generateChildByString(str + i, 5, false);
            } else {
                child = str + i;
            }
            childs.push([str + i, child]);
        }

        return childs;
    }
});