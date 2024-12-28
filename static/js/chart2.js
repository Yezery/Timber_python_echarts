async function setChart2() {
  // 1、获取要画图表的标签
  var myChart = echarts.init(document.getElementById("chart5"));
  // 初始化数据
  let chart_data = [];
  
  // 2. 网络请求，获取 location 数据
  try {
    const response = await fetch("/location_statistics");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); // 获取后端返回的数据
    chart_data = data.data; // 提取数据
  } catch (error) {
    console.error("Error fetching data:", error);
    return; // 如果发生错误，提前退出
  }
  // 3、定义图表配置项
  var option = {
    color: ["#ffcc99"], // 颜色为黄色
    radar: {
      // 雷达图的文本
      indicator: chart_data.map(item => ({
        name: item.name,
        max: Math.max(...chart_data.map(item => item.value)) + 5,  // 设置最大值
      })),
      radius: 130, // 雷达图大小
      shape: "circle" // 形状为圆形
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: chart_data.map(item => item.value),
            name: "Location Frequency",
          },
        ],
      },
    ],
  };
  // 3、生成图表
  myChart.setOption(option, true);
}
setChart2();
