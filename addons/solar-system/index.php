<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable = no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<title dir="ltr">3D CSS Solar System</title>
		<link rel="stylesheet" type="text/css" media="screen" href="./css/styles.css?rand=<?=time()?>">
	</head>
  <body>
	<!-- 太阳系 Start-->
    <div class="opening hide-UI view-2D zoom-large data-open controls-close" id="solar-system-body">
      <div id="navbar" class="solar-system-navbar">
			<!-- <a id="toggle-data" href="#data"><i class="icon-data"></i>Menu</a> -->
			<h1>
				浩瀚星空中的一粒微尘
				<p>浩瀚宇宙离不开每颗星的闪亮</p>
			</h1>
      </div>
      <div id="data" class="solar-system-menu">
          <p class="planet-item">
              <a class="sun" title="太阳" href="#sunspeed">太阳</a>
              <a class="mercury" title="水星" href="#mercuryspeed">水星</a>
              <a class="venus" title="金星" href="#venusspeed">金星</a>
              <a class="earth active" title="地球" href="#earthspeed">地球</a>
              <a class="mars" title="火星" href="#marsspeed">火星</a>
              <a class="jupiter" title="木星" href="#jupiterspeed">木星</a>
              <a class="saturn" title="土星" href="#saturnspeed">土星</a>
              <a class="uranus" title="天王星" href="#uranusspeed">天王星</a>
              <a class="neptune" title="海王星" href="#neptunespeed">海王星</a>
          </p>
          <p>
              <a href="https://beian.miit.gov.cn" target="_black" rel="nofollow">苏ICP备18017601号-2</a>
          </p>
      </div>
     
      <div id="universe" class="scale-stretched">
          <div id="galaxy">
              <div id="solar-system" class="earth">
                  <div id="mercury" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <dl class="infos">
                                  <dt>水星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="venus" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <dl class="infos">
                                  <dt>金星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="earth" class="orbit">
                      <div class="pos">
                          <div class="orbit">
                              <div class="pos">
                                  <div class="moon"></div>
                              </div>
                          </div>
                          <div class="planet">
                              <dl class="infos">
                                  <dt>地球</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="mars" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <dl class="infos">
                                  <dt>火星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="jupiter" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <dl class="infos">
                                  <dt>木星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="saturn" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <div class="ring"></div>
                              <dl class="infos">
                                  <dt>土星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="uranus" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <dl class="infos">
                                  <dt>天王星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="neptune" class="orbit">
                      <div class="pos">
                          <div class="planet">
                              <dl class="infos">
                                  <dt>海王星</dt>
                                  <dd><span></span></dd>
                              </dl>
                          </div>
                      </div>
                  </div>
                  <div id="sun">
                      <dl class="infos">
                          <dt>太阳</dt>
                          <dd><span></span></dd>
                      </dl>
                  </div>
              </div>
          </div>
      </div>
  </div>
  <!-- 太阳系 END -->
  </body>
  <script src="/addons/jquery/jquery-2.2.4.min.js"></script>
  <script src="./js/prefixfree.min.js?rand=<?=time()?>"></script>
  <script src="./js/scripts.js?rand=<?=time()?>"></script>
</html>