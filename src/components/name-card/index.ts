import type { NameAnalysis } from '../../types';

Component({
  properties: {
    nameData: {
      type: Object,
      value: {} as NameAnalysis,
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
