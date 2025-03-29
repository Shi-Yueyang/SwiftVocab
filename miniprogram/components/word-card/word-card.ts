Component({
  properties: {
    word: {
      type: String,
      value: ''
    },
    definition: {
      type: String,
      value: ''
    },
    matchingLyric: {
      type: String,
      value: ''
    },
    quizWord: {
      type: String,
      value: ''
    }
  },

  data: {
    inputValue: '',
    isShowHint: false
  },

  methods: {
    onInput(e: any) {
      this.triggerEvent('input', e.detail.value);
    },

    onSubmit() {
      this.setData({
        inputValue: '',
        isShowHint: false
      });

      this.triggerEvent('submit');
    },


    showHint() {
      this.setData({
        isShowHint: !this.data.isShowHint
      });
    }
  }
}); 