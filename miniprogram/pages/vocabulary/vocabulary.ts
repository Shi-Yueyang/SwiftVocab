interface Word {
  id: string;
  word: string;
  definition: string;
  matching_lyric: string;
}

interface LearningProgress {
  finalIndex: number;
  _id?: string; // For cloud database
  _openid?: string; //to identify the user
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
    allWords: [] as Word[],
    currentWord: null as Word | null,
    quizWord: "",
    progress: null as LearningProgress | null,
    currentIndex: 0,
    isShowHint: false,
    selectedOption: -1,
    inputValue: "",
    feedback: "",
  },

  onLoad() {
    this.loadProgress();
  },

  async loadProgress() {
    try {
      const db = wx.cloud.database();

      const { data } = await db.collection("userProgress").get();

      if (data && data.length > 0) {
        const progress = data[0] as DBProgress;
        this.setData({
          progress: {
            finalIndex: progress.finalIndex,
            _id: progress._id,
            _openid: progress._openid,
          },
        });
        console.log("Loaded progress from cloud:", progress);
      } else {
        // Create initial progress document
        const initialProgress: LearningProgress = {
          finalIndex: 0,
        };

        await db.collection("userProgress").add({
          data: initialProgress,
        });

        this.setData({
          progress: initialProgress,
        });
        console.log("Created initial progress in cloud:", initialProgress);
      }

      this.fetchWords();
    } catch (err) {
      console.error("Failed to load progress from cloud:", err);
    }
  },

  async saveProgress() {
    try {
      if (this.data.progress) {
        const db = wx.cloud.database();
        const { data } = await db
          .collection("userProgress")
          .where({
            _id: this.data.progress._id,
          })
          .get();

        if (data && data.length > 0) {
          const existingProgress = data[0] as DBProgress;
          // Update existing progress
          await db
            .collection("userProgress")
            .doc(existingProgress._id)
            .update({
              data: {
                finalIndex:
                  existingProgress.finalIndex + this.data.allWords.length,
              },
            });
        }
      }
    } catch (err) {
      console.error("Failed to save progress to cloud:", err);
      wx.showToast({
        title: "Failed to save progress",
        icon: "none",
      });
    }
  },

  async fetchWords() {
    try {
      const db = wx.cloud.database();
      const startIndex = this.data.progress ? this.data.progress.finalIndex : 0;
      console.log("start index", startIndex);
      const { data } = await db
        .collection("vocab")
        .skip(startIndex)
        .limit(5)
        .get(); // Fetch from startIndex

      const allWords = (data as DBWord[]).map((item) => ({
        id: item._id,
        word: item.word,
        definition: item.definition,
        matching_lyric: item.matching_lyric,
      }));

      const nextWord = allWords[0];
      const shuffledWord = nextWord.word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

      this.setData({
        allWords: allWords,
        quizWord: shuffledWord,
        currentIndex: 0,
        currentWord: {
          ...nextWord,
          matching_lyric: nextWord.matching_lyric
            .toLowerCase()
            .replace(nextWord.word, "_____"),
        },
      });
    } catch (err) {
      console.error("Failed to fetch words:", err);
      wx.showToast({
        title: "Failed to load words",
        icon: "none",
      });
    }
  },

  onInput(e: any) {
    this.setData({
      inputValue: e.detail,
    });
  },

  onSubmit() {
    const inputValue = this.data.inputValue.toLowerCase().trim();
    const correctWord = this.data.currentWord
      ? this.data.currentWord.word.toLowerCase()
      : "";
    if (inputValue === correctWord) {
      this.nextWord();
    }
  },

  showHint() {
    this.setData({
      isShowHint: true,
    });
  },

  async nextWord() {
    const nextIndex = this.data.currentIndex + 1;
    if (nextIndex === this.data.allWords.length) {
      await this.saveProgress();
      wx.showModal({
        title: "Congratulations!",
        content: "你完成了本次学习！",
        showCancel: true,
        cancelText: "继续学习",
        confirmText: "返回首页",
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/index/index",
            });
          } else {
            this.fetchWords();
          }
        },
      });
      return;
    } else {
      const nextWord = this.data.allWords[nextIndex];
      const shuffledWord = nextWord.word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
      this.setData({
        currentIndex: nextIndex,
        quizWord: shuffledWord,
        inputValue: "",
        feedback: "",
        currentWord: {
          ...nextWord,
          matching_lyric: nextWord.matching_lyric
            .toLowerCase()
            .replace(nextWord.word, "_____"),
        },
      });
    }
  },
});
