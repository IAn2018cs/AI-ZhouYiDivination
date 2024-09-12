import axios from 'axios';

export default {
    name: 'App',
    data() {
        return {
            question: '',
            svgResult: null,
            isLoading: false
        }
    },
    methods: {
        async performDivination() {
            if (this.isLoading) return;

            this.isLoading = true;
            this.svgResult = null;

            try {
                // // 使用测试接口
                // const response = await axios.post('/divinate-test', { question: this.question });
                // 使用实际接口
                const response = await axios.post('/divinate', { question: this.question });
                this.svgResult = response.data.svg;
            } catch (error) {
                console.error('占卜失败:', error);
                alert('占卜失败,请稍后再试');
            } finally {
                this.isLoading = false;
            }
        },
        saveImage() {
            const svgElement = this.$el.querySelector('.svg-container svg');
            if (!svgElement) {
                console.error('SVG element not found');
                return;
            }

            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.onload = () => {
                canvas.width = img.width * 2;  // 增加分辨率
                canvas.height = img.height * 2;
                ctx.scale(2, 2);  // 缩放绘图上下文
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = '易经占卜结果.png';
                    link.click();
                    URL.revokeObjectURL(url);
                }, 'image/png');
            };
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        },
        async shareImage() {
            try {
                const svgElement = this.$el.querySelector('.svg-container svg');
                if (!svgElement) {
                    console.error('SVG element not found');
                    return;
                }

                const svgData = new XMLSerializer().serializeToString(svgElement);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const img = new Image();
                img.onload = async () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    try {
                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                        const file = new File([blob], '易经占卜结果.png', { type: 'image/png' });

                        if (navigator.share && navigator.canShare({ files: [file] })) {
                            await navigator.share({
                                files: [file],
                                title: '我的易经占卜结果',
                                text: '查看我通过易经八卦得到的占卜结果!'
                            });
                        } else {
                            // 如果 Web Share API 不可用,将图片转换为 Data URL 并复制到剪贴板
                            const dataUrl = canvas.toDataURL('image/png');
                            await navigator.clipboard.writeText(dataUrl);
                            alert('图片链接已复制到剪贴板。您可以将其粘贴到支持的应用程序中分享。');
                        }
                    } catch (error) {
                        console.error('分享失败:', error);
                        alert('分享失败,请稍后再试。');
                    }
                };
                img.onerror = (error) => {
                    console.error('图片加载失败:', error);
                    alert('图片生成失败,请稍后再试。');
                };
                img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
            } catch (error) {
                console.error('分享过程出错:', error);
                alert('分享过程出错,请稍后再试。');
            }
        }
    }
}
