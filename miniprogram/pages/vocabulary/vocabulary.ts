Page({
  data: {
    words: [
      { word: 'Enchanted', definition: 'Filled with delight' },
      { word: 'Treacherous', definition: 'Guilty of betrayal' },
      { word: 'Delicate', definition: 'Easily broken or damaged' },
      { word: 'Fearless', definition: 'Without fear' },
      { word: 'Red', definition: 'A color' },
      { word: 'Love Story', definition: 'A romantic tale' },
      { word: 'You Belong With Me', definition: 'A song about wanting someone' },
      { word: 'Shake It Off', definition: 'To ignore criticism' },
      { word: 'Blank Space', definition: 'An empty area' },
      { word: 'Bad Blood', definition: 'Ill will or resentment' },
    ],
    quizWord: { word: '', definition: '',originalWord:'' },
    inputValue: '',
    feedback: '',
  },
  onLoad() {
    this.setQuizWord();
  },
  onInput(event: any) {
    this.setData({
      inputValue: event.detail.value,
    });
  },
  onSubmit() {
    const inputValue = this.data.inputValue.toLowerCase();
    const quizWord = this.data.quizWord.originalWord.toLowerCase();
    if (inputValue === quizWord) {
      this.setData({
        feedback: 'Correct!',
      });
      this.setQuizWord();
      this.setData({
        inputValue: '',
      });
    } else {
      this.setData({
        feedback: 'Incorrect. Try again!',
      });
    }
  },
  shuffleWord(word: string) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  },
  setQuizWord() {
    const randomIndex = Math.floor(Math.random() * this.data.words.length);
    const quizWord = this.data.words[randomIndex];
    this.setData({
      quizWord: {
        word: this.shuffleWord(quizWord.word),
        definition: quizWord.definition,
        originalWord:quizWord.word
      },
    });
  },
});