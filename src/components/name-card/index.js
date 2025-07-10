"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Component({
    properties: {
        nameData: {
            type: Object,
            value: {},
        },
        showScore: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        isExpanded: false,
    },
    methods: {
        onTap() {
            this.setData({
                isExpanded: !this.data.isExpanded,
            });
            this.triggerEvent('tap');
        },
        onShare() {
            this.triggerEvent('share');
        },
        onSave() {
            this.triggerEvent('save');
        },
    },
});
