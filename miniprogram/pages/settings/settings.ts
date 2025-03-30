Page({
  data: {
    buttons: [{text: '取消'}, {text: '确认'}],
    nickName: '',
    avatarUrl: '',
    vocabularyCategories: [
      { name: 'Taylor Swift', progress: 1 },
      { name: 'Lana Del Ray', progress: 2 },
      { name: 'Billie Eilish', progress: 3 },
      { name: 'Eminem', progress: 3 }
    ]
  },
  onLoad() {
    console.log('Settings page loaded');

  },
})