(function () {
  window.showExtra = cls => {
    let extraClassList = document.getElementsByClassName(cls);

    for (let i = 0; i < extraClassList.length; i++) {
      if (!/show/.test(extraClassList[i].className)) {
        extraClassList[i].className =
          extraClassList[i].className.replace(" fadeOut", "") + " fadeIn show";
      } else {
        extraClassList[i].className = extraClassList[i].className.replace(
          " fadeIn",
          " fadeOut"
        );

        setTimeout(() => {
          extraClassList[i].className = extraClassList[i].className.replace(
            " show",
            ""
          );
        }, 500);
      }
    }
  };

  window.currentCode = function (cls) {
    if (!/current/.test(cls.parentNode.className)) {
      for (let i = 0; i < cls.parentNode.parentNode.children.length; i++) {
        cls.parentNode.parentNode.children[i].className += " hide";
      }
      cls.parentNode.className =
        cls.parentNode.className.replace(" hide", "") + " current";
    } else {
      for (let i = 0; i < cls.parentNode.parentNode.children.length; i++) {
        cls.parentNode.parentNode.children[i].className =
          cls.parentNode.parentNode.children[i].className.replace(" hide", "");
      }
      cls.parentNode.className = cls.parentNode.className.replace(
        " current",
        ""
      );
    }
  };

  window.showModal = function (cls) {
    let target = document.getElementById(cls);
    if (!/show/.test(target.className)) {
      let currentParent = document.getElementsByClassName("relative current");
      console.log(currentParent);
      target.className += " show";
    }
  };

  window.hideModel = function (e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    } else {
      //否则，我们需要使用IE的方式来取消事件冒泡
      window.event.cancelBubble = true;
    }
    console.log(e);
    let targetName = e.tagName;
    console.log(targetName);
    if (targetName == "PRE") {
      e.className = e.className.replace(" show", "");
    }
  };
})();
