interface Word {
  id: string;
  word: string;
  definition: string;
  matching_lyric: string;
  title: string;
}

interface LearningProgress {
  finalIndex: number;
  source: string;
  totalNumber?:number;
  progressPercent?:number;
  _id?: string; 
  _openid?: string; 
}

interface DBWord extends Word {
  _id: string;
  _openid: string;
}

interface DBProgress extends LearningProgress {
  _id: string;
  _openid: string;
}

interface DBUserExperience extends UserExperience {
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
    selectedOption: -1,
    inputValue: "",
    feedback: "",
    source: "",
    title: "",
  },

  onLoad(options) {
    this.loadProgress();
    const app = getApp<IAppOption>();
    if (options.sourceId) {
      const source = app.globalData.allSources[parseInt(options.sourceId)];
      this.setData({
        source: source.name,
      });
    }
  },

  async loadProgress() {
    try {
      const db = wx.cloud.database();

      const { data } = await db
        .collection("userProgress")
        .get();
      const progress = (data as DBProgress[]).find(
        (item) => item.source === this.data.source  
      );
      if (progress) {
        this.setData({
          progress: {
            finalIndex: progress.finalIndex,
            source: progress.source,
            _id: progress._id,
            _openid: progress._openid,
          },
        });
      } else {
        // Create initial progress document
        const initialProgress: LearningProgress = {
          finalIndex: 0,
          source: this.data.source,
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

      const app = getApp<IAppOption>();
      if (app.globalData.userExperience && app.globalData.userExperience._id) {
        app.globalData.userExperience.totalWords += this.data.allWords.length;
        const db = wx.cloud.database();
        await db
          .collection("userExperience")
          .doc(app.globalData.userExperience._id)
          .update({
            data: {
              totalWords: app.globalData.userExperience.totalWords,
            },
          });
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
      const { data } = await db
        .collection("vocab")
        .where({
          source: this.data.source,
        })
        .skip(startIndex)
        .limit(5)
        .get(); // Fetch from startIndex

      const allWords = (data as DBWord[]).map((item) => ({
        id: item._id,
        word: item.word,
        definition: item.definition,
        matching_lyric: item.matching_lyric,
        title: item.title,
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
      console.log('cheat',nextWord.word);

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
            wx.switchTab({
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
      console.log('cheat',nextWord.word);
    }
  },
});
