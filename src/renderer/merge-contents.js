module.exports = {
    merge: function (vm, element, elementContent) {
        var slots = {
            unnamed: null,
            named: null
        };

        elementContent.compiled = true;


        // Pasting content into a component with empty template
        if (
            element &&
            element.inner &&
            !element.inner.length &&
            element.dirs.component.status !== 'unresolved'
        ) {
            element.inner = elementContent.inner;
            return;
        }

        if (!element.inner[0] || !element.inner[0].inner) {
            return;
        }

        // Slots merging
        var inner = element.inner[0].inner;
        var content = elementContent.inner;

        for (var i = inner.length - 1; i >= 0; i--) {
            if (inner[i].name === 'slot') {
                if (inner[i].attribs.name) {
                    slots.named = slots.named || {};
                    slots.named[inner[i].attribs.name] = inner[i];
                } else {
                    if (!slots.unnamed) {
                        slots.unnamed = inner[i];
                    } else {
                        vm.__states.$logger.warn('Duplicate unnamed <slot>', common.onLogMessage(vm));
                    }
                }
            }
        }

        // If provided content didn't render
        // if (slots.unnamed && !slots.named && !elementContent.inner.length) {
        //     slots.unnamed.inner = [];
        // }

        if (slots.unnamed || slots.named) {
            for (var j = 0; j < content.length; j++) {
                if (
                    content[j].attribs &&
                    content[j].attribs.slot &&
                    slots.named &&
                    slots.named[content[j].attribs.slot]
                ) {
                    this.fillSlot(
                        slots.named[content[j].attribs.slot],
                        content[j]
                    );
                } else if (slots.unnamed) {
                    this.fillSlot(
                        slots.unnamed,
                        content[j]
                    );
                }
            }
        }
    },

    fillSlot: function (element, item) {
        if (!element.filled) {
            element.inner = [];
            element.filled = true;
        }

        element.inner.push(item);
    }
};