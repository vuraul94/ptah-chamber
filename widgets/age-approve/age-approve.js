(function ($) {
  window.addEventListener("load", function () {
    setTimeout(() => {
      scrollTo(0, 0); 
      document.body.style.overflow = "hidden";
    },10);
  });

  const approveAgeHandler = ($scope) => {
    const $ageApprove = $scope.find(".age-approve");
    if ($ageApprove.length === 0) {
      return;
    }

    const approveBtn = $ageApprove.find(".age-approve__button");
    approveBtn.on("click", function () {
      const $clickedBtn = $(this);
      if ($ageApprove.hasClass("open") || $ageApprove.hasClass("rejected")) {
        return;
      }
      if ($clickedBtn.hasClass("age-approve__button--yes")) {
        $ageApprove.addClass("open");
        document.body.style.overflow = "auto";
      }
      if ($clickedBtn.hasClass("age-approve__button--no")) {
        $ageApprove.addClass("rejected");
      }
    });

  };

  $(window).on("elementor/frontend/init", function () {
    elementorFrontend.hooks.addAction(
      "frontend/element_ready/age-approve.default",
      approveAgeHandler
    );
  });
})(jQuery);
