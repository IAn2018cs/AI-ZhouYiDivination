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
                const response = await axios.post('/divinate', { question: this.question });
                this.svgResult = response.data.image;
            } catch (error) {
                console.error('占卜失败:', error);
                alert('占卜失败,请稍后再试');
            } finally {
                this.isLoading = false;
            }
        },
        onImageLoad(event) {
            event.target.classList.add('loaded');
        },
        saveImage() {
            if (!this.svgResult) {
                console.error('没有可保存的图片');
                alert('没有可保存的图片');
                return;
            }
        
            // 创建一个临时的 a 标签用于下载
            const link = document.createElement('a');
            link.href = this.svgResult;  // 这里 svgResult 实际上是 PNG 图片的 base64 数据
            link.download = '易经占卜结果.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
