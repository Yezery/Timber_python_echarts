async function setChart5() {
  // 1. 获取要画图表的标签
  var myChart = echarts.init(document.getElementById("chart6"));
  
  // 初始化数据
  let chart_data = [];
  
  // 2. 网络请求
  try {
    const response = await fetch("/grade_statistics");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // 获取后端返回的数据
    chart_data = data.data; // 从后端提取出 `data` 部分
  } catch (error) {
    console.error("Error fetching data:", error);
    return; // 如果发生错误，提前退出，不执行后续代码
  }
  
  // 3. 定义图表配置项
  var option = {
    color: ["#9accff", "#ffcccc", "#93e7be", "#ffcc99"], // 饼图颜色
    tooltip: { trigger: "item" }, // 鼠标悬停提示框
    legend: {
      bottom: 20, // 图例距下边20
      itemWidth: 10, // 图例宽度
      itemHeight: 10, // 图例高度
    },
    grid: { top: 40 }, // 图表距上边40
    series: [
      {
        type: "pie", // pie类型为饼图
        center: ["50%", "47%"], // 饼图位置
        radius: ["30%", "50%"], // 饼图大小
        itemStyle: {
          borderRadius: 5, // 每块的边框圆角为5
          borderColor: "#fff", // 每块的边框颜色为白色
          borderWidth: 4, // 每块的边框宽度
        },
        data: chart_data, // 使用后端获取的数据
      },
    ],
  };
  
  // 4. 生成图表
  myChart.setOption(option);
}

// 调用函数
setChart5();
