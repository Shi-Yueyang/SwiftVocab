interface QuizWord{
  word: string;
  definition: string;
  originalWord: string;
  matching_lyric: string;
}

Page({
  data: {
    words: [] as QuizWord[],
    quizWord: { word: '', definition: '', originalWord: '', matching_lyric: '' },
    inputValue: '',
    feedback: '',
    hintMessage: '',
  },
  onLoad() {
    wx.cloud.init();
    this.loadWords();
  },
  loadWords() {
    const db = wx.cloud.database({ env: 'syy1-8g91c2cm82ae8254' });
    db.collection('vocab')
      .get()
      .then((res) => {
        const words = res.data.map((item: any) => ({
          word: item.word,
          definition: item.definition,
          originalWord: item.originalWord,
          matching_lyric: item.matching_lyric,
        })) as QuizWord[];
        this.setData({ words }, () => {
          this.setQuizWord();
        });
      })
      .catch((err) => {
        console.error('Failed to load words:', err);
      });
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
        feedback: '',
      });
      this.setQuizWord();
      this.setData({
        inputValue: '',
        hintMessage: '',
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
    if (this.data.words.length === 0) return;
    const randomIndex = Math.floor(Math.random() * this.data.words.length);
    const quizWord = this.data.words[randomIndex];
    this.setData({
      quizWord: {
        word: this.shuffleWord(quizWord.word),
        definition: quizWord.definition,
        originalWord: quizWord.word,
        matching_lyric: quizWord.matching_lyric,
      },
    });
  },
  onHint() {
    this.setData({
      hintMessage: this.data.quizWord.matching_lyric.toLowerCase().replace(this.data.quizWord.originalWord, '____'),
    });
  },
});