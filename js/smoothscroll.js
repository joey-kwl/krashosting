(function(w,d,undefined){'use strict';function polyfill(){if('scrollBehavior'in d.documentElement.style){return;}var Element=w.HTMLElement||w.Element;var SCROLL_TIME=800;var original={scroll:w.scroll||w.scrollTo,scrollBy:w.scrollBy,scrollIntoView:Element.prototype.scrollIntoView};var now=w.performance&&w.performance.now?w.performance.now.bind(w.performance):Date.now;function scrollElement(x,y){this.scrollLeft=x;this.scrollTop=y;}function ease(k){return 0.5*(1-Math.cos(Math.PI*k));}function shouldBailOut(x){if(typeof x!=='object'||x===null||x.behavior===undefined||x.behavior==='auto'||x.behavior==='instant'){return true;}if(typeof x==='object'&&x.behavior==='smooth'){return false;}throw new TypeError('behavior not valid');}function findScrollableParent(el){var isBody;var hasScrollableSpace;var hasVisibleOverflow;do{el=el.parentNode;isBody=el===d.body;hasScrollableSpace=el.clientHeight<el.scrollHeight||el.clientWidth<el.scrollWidth;hasVisibleOverflow=w.getComputedStyle(el,null).overflow==='visible';}while(!isBody&&!(hasScrollableSpace&&!hasVisibleOverflow));isBody=hasScrollableSpace=hasVisibleOverflow=null;return el;}function step(context){context.frame=w.requestAnimationFrame(step.bind(w,context));var time=now();var value;var currentX;var currentY;var elapsed=(time-context.startTime)/SCROLL_TIME;elapsed=elapsed>1?1:elapsed;value=ease(elapsed);currentX=context.startX+(context.x-context.startX)*value;currentY=context.startY+(context.y-context.startY)*value;context.method.call(context.scrollable,currentX,currentY);if(currentX===context.x&&currentY===context.y){w.cancelAnimationFrame(context.frame);return;}}function smoothScroll(el,x,y){var scrollable;var startX;var startY;var method;var startTime=now();var frame;if(el===d.body){scrollable=w;startX=w.scrollX||w.pageXOffset;startY=w.scrollY||w.pageYOffset;method=original.scroll;}else{scrollable=el;startX=el.scrollLeft;startY=el.scrollTop;method=scrollElement;}if(frame){w.cancelAnimationFrame(frame);}step({scrollable:scrollable,method:method,startTime:startTime,startX:startX,startY:startY,x:x,y:y,frame:frame});}w.scroll=w.scrollTo=function(){if(shouldBailOut(arguments[0])){original.scroll.call(w,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);return;}smoothScroll.call(w,d.body,~~arguments[0].left,~~arguments[0].top);};w.scrollBy=function(){if(shouldBailOut(arguments[0])){original.scrollBy.call(w,arguments[0].left||arguments[0],arguments[0].top||arguments[1]);return;}smoothScroll.call(w,d.body,~~arguments[0].left+(w.scrollX||w.pageXOffset),~~arguments[0].top+(w.scrollY||w.pageYOffset));};Element.prototype.scrollIntoView=function(){if(shouldBailOut(arguments[0])){original.scrollIntoView.call(this,arguments[0]||true);return;}var scrollableParent=findScrollableParent(this);var parentRects=scrollableParent.getBoundingClientRect();var clientRects=this.getBoundingClientRect();if(scrollableParent!==d.body){smoothScroll.call(this,scrollableParent,scrollableParent.scrollLeft+clientRects.left-parentRects.left,scrollableParent.scrollTop+clientRects.top-parentRects.top);w.scrollBy({left:parentRects.left,top:parentRects.top,behavior:'smooth'});}else{w.scrollBy({left:clientRects.left,top:clientRects.top,behavior:'smooth'});}};}if(typeof exports==='object'){module.exports={polyfill:polyfill};}else{polyfill();}})(window,document);