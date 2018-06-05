import './scss/a'

// 写jq
$('.jquery-test').click(() => {
  console.log('jq操作');
  // console.log($(this));
});

$('.js_b').html('我是动态插入的数据');