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
    isAnswerLocked: false,
    showResult: false,
    isCorrect: false,
    isShowHint: false
  },

  methods: {
    onInput(e: any) {
      this.setData({
        inputValue: e.detail.value
      });
    },

    onSubmit() {
      const isCorrect = this.data.inputValue.toLowerCase() === this.properties.word.toLowerCase();
      
      this.setData({
        isAnswerLocked: true,
        showResult: true,
        isCorrect: isCorrect
      });

      this.triggerEvent('submit', { isCorrect });
    },

    nextWord() {
      this.setData({
        inputValue: '',
        isAnswerLocked: false,
        showResult: false,
        isShowHint: false
      });
      this.triggerEvent('next');
    },



    showHint() {
      this.setData({
        isShowHint: !this.data.isShowHint
      });
    }
  }
}); 