interface Word {
  id: string;
  word: string;
  definition: string;
  matching_lyric: string;
}

interface LearningProgress {
  currentIndex: number;
  totalWords: number;
  completedWords: string[]; // Array of completed word IDs
  lastUpdated: string;
  _id?: string; // For cloud database
  _openid?: string; // For cloud database
}

interface DBWord extends Word {
  _id: string;
  _openid: string;
}

interface DBProgress extends LearningProgress {
  _id: string;
  _openid: string;
}

Page({
  data: {
    currentWord: null as Word | null,
    quizWord: '',
    currentIndex: 0,
    words: [] as Word[],
    progress: null as LearningProgress | null,
    showResult: false,
    isCorrect: false,
    isShowHint: false,
    selectedOption: -1,
    isAnswerLocked: false,
    inputValue: '',
    feedback: ''
  },

  onLoad() {
    this.loadProgress();
    this.fetchWords();
  },

  async loadProgress() {
    try {
      const db = wx.cloud.database();
      // Get the current user's progress
      const { data } = await db.collection('userProgress')
        .where({
          _openid: db.command.exists(true)
        })
        .get();

      if (data && data.length > 0) {
        const progress = data[0] as DBProgress;
        this.setData({
          progress: {
            currentIndex: progress.currentIndex,
            totalWords: progress.totalWords,
            completedWords: progress.completedWords,
            lastUpdated: progress.lastUpdated,
            _id: progress._id,
            _openid: progress._openid
          }
        });
        console.log('Loaded progress from cloud:', progress);
      }
    } catch (err) {
      console.error('Failed to load progress from cloud:', err);
    }
  },

  async saveProgress() {
    try {
      const db = wx.cloud.database();
      const progress: LearningProgress = {
        currentIndex: this.data.currentIndex,
        totalWords: this.data.words.length,
        completedWords: this.data.words
          .slice(0, this.data.currentIndex)
          .map(word => word.id),
        lastUpdated: new Date().toISOString()
      };

      // Check if progress document exists
      const { data } = await db.collection('userProgress')
        .where({
          _openid: db.command.exists(true)
        })
        .get();

      if (data && data.length > 0) {
        const existingProgress = data[0] as DBProgress;
        // Update existing progress
        await db.collection('userProgress').doc(existingProgress._id).update({
          data: progress
        });
      } else {
        // Create new progress document
        await db.collection('userProgress').add({
          data: progress
        });
      }

      this.setData({ progress });
    } catch (err) {
      console.error('Failed to save progress to cloud:', err);
      wx.showToast({
        title: 'Failed to save progress',
        icon: 'none'
      });
    }
  },

  async fetchWords() {
    try {
      const db = wx.cloud.database();
      const { data } = await db.collection('vocab').get();

      // Convert DB response to Word type
      const words = (data as DBWord[]).map(item => ({
        id: item._id,
        word: item.word,
        definition: item.definition,
        matching_lyric: item.matching_lyric
      }));

      // Sort words by ID to ensure consistent order
      const sortedWords = words.sort((a, b) => a.id.localeCompare(b.id));

      // If there's progress, start from the last position
      const startIndex = this.data.progress?.currentIndex || 0;

      const chosenWord = sortedWords[startIndex];
      const shuffledWord = chosenWord.word
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');

      this.setData({
        words: sortedWords,
        quizWord: shuffledWord,
        currentIndex: startIndex,
        currentWord: { ...chosenWord, matching_lyric: chosenWord.matching_lyric.toLowerCase().replace(chosenWord.word, '_____') }
      });
      console.log(this.data.currentWord)
    } catch (err) {
      console.error('Failed to fetch words:', err);
      wx.showToast({
        title: 'Failed to load words',
        icon: 'none'
      });
    }
  },

  onInput(e: any) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  onSubmit() {
    if (this.data.isAnswerLocked) return;

    const inputValue = this.data.inputValue.toLowerCase().trim();
    const correctWord = this.data.currentWord?.word.toLowerCase();

    this.setData({
      isAnswerLocked: true,
      showResult: true,
      isCorrect: inputValue === correctWord
    });

    // Save progress after a short delay if correct
    setTimeout(() => {
      if (inputValue === correctWord) {
        this.nextWord();
      }
    }, 1500);
  },

  showHint() {
    this.setData({
      isShowHint: true
    });
  },

  async nextWord() {
    const nextIndex = this.data.currentIndex + 1;

    if (nextIndex >= this.data.words.length) {
      // All words completed
      wx.showModal({
        title: 'Congratulations!',
        content: 'You have completed all words!',
        showCancel: false,
        success: async () => {
          try {
            const db = wx.cloud.database();
            // Delete progress document to reset progress
            if (this.data.progress?._id) {
              await db.collection('userProgress').doc(this.data.progress._id).remove();
            }

            this.setData({
              currentIndex: 0,
              progress: null,
              currentWord: this.data.words[0],
              inputValue: '',
              feedback: ''
            });
          } catch (err) {
            console.error('Failed to reset progress:', err);
          }
        }
      });
      return;
    }

    this.setData({
      currentIndex: nextIndex,
      currentWord: this.data.words[nextIndex],
      showResult: false,
      inputValue: '',
      feedback: '',
      isAnswerLocked: false
    });

    await this.saveProgress();
  },

  retryWord() {
    this.setData({
      showResult: false,
      inputValue: '',
      feedback: '',
      isAnswerLocked: false
    });
  }
});