var data = {};
var ind1 = false,
  ind2 = false,
  ind3 = false,
  loginPass = false,
  passwordPass = false,
  confirmPass = false,
  mailPass = false;
colorSwapers = document.querySelectorAll('.colorSwap');

// Очистка формы после проведения операции
function clear() {
  $('.bank input').val("");
  loginLenghtControl(false);
  passwordOkInd(false, false, false);
  for (swaper of colorSwapers) {
    swaper.style.color = "#ef3038";
  }
  passwordConfirmCompare();
  mailvalidator();
}
// фронт-валидаторы(исп на регестрации)
function loginLenghtControl(loginflag) {
  if ($('#regName').val().length > 2 && loginflag) {
    $('.ok').addClass('opacityOn');
    loginPass = true
  } else {
    $('.ok').removeClass('opacityOn');
    loginPass = false;
  }
}

function colorSwap(selector, condition, ind) {
  if (condition) {
    $(selector).css('color', 'green');
    return true;
  } else {
    $(selector).css('color', '#ef3038');
    return false;
  }
}

function passwordOkInd(ok1, ok2, ok3) {
  if (ok1 && ok2 && ok3) {
    $('.psok').addClass('opacityOn');
    passwordPass = true;
  } else {
    $('.psok').removeClass('opacityOn');
    passwordPass = false;
  }
}

function passwordValidator() {
  ind1 = colorSwap('.longer', $('#regPas').val().length > 7);
  ind2 = colorSwap('.digits', $('#regPas').val().match(/\d/g));
  ind3 = colorSwap('.register', $('#regPas').val().match(/[A-Z]/g));
  passwordOkInd(ind1, ind2, ind3);
}

function passwordConfirmCompare() {
  if ($('#regPas').val() == $('#regPasCon').val() && $('#regPasCon').val().length > 0) {
    $('.pscok').addClass('opacityOn');
    confirmPass = true;
  } else {
    $('.pscok').removeClass('opacityOn');
    confirmPass = false;
  }
}

function mailvalidator() {
  if ($('#regMail').val().match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)) {
    $('.mailok').addClass('opacityOn');
    return true
  } else {
    $('.mailok').removeClass('opacityOn');
    mailPass = false
    return false
  }
}

$('.passwordBank input').focus(function() {
  $('.passwordValidator').addClass('opacityOn');
});
$('.passwordBank input').focusout(function() {
  $('.passwordValidator').removeClass('opacityOn');
});

// Онинпуты форм валидация
document.getElementById('regName').oninput = function() {
  data = {
    val: $('#regName').val()
  }
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/auths/check'
  }).done(function(data) {
    if (!data.pass) {
      $('.loginExist').addClass('opacityOn');
      loginLenghtControl(data.pass)
    }
    if (data.pass) {
      $('.loginExist').removeClass('opacityOn');
      loginLenghtControl(data.pass)
    }
  })
};
document.getElementById('regPas').oninput = function() {
  passwordValidator();
  passwordConfirmCompare();
}
document.getElementById('regPasCon').oninput = function() {
  passwordConfirmCompare();
}
document.getElementById('regMail').oninput = function() {
  if (mailvalidator()) {
    data = {
      val: $('#regMail').val()
    }
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auths/checkMail'
    }).done(function(data) {
      if (!data.pass) {
        $('.mailExist').addClass('opacityOn');
        mailPass = false;
        setTimeout(function() {
          $('.mailok').removeClass('opacityOn');
          $('.mailExist').removeClass('opacityOn');
        }, 1000)
      }
      if (data.pass) {
        $('.mailExist').removeClass('opacityOn');
        $('.mailok').addClass('opacityOn');
        mailPass = true;
      }
    })
  }
}

// регестрация
$('.regSub').click(
  function(e) {
    e.preventDefault();
    if (passwordPass && loginPass && confirmPass && mailPass) {
      data = {
        login: $('#regName').val(),
        password: $('#regPas').val(),
        passwordConfirm: $('#regPasCon').val(),
        mail: $('#regMail').val()
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auths/register'
      }).done(function(data) {
        console.log(data);
        $('.regPopUp').removeClass('opacityOn');
        $('.regSucess').addClass('opacityOn');
        clear();
        setTimeout(function() {
          $('.regSucess').removeClass('opacityOn')
          $(location).attr('href', '/');
        }, 2064)
      })
    } else {
      $('.warning').addClass('opacityOn');
      setTimeout(function() {
        $('.warning').removeClass('opacityOn');
      }, 1500)
    }
  }
)
//авторизация
$('.autBut').click(
  function(e) {
    e.preventDefault();
    data = {
      login: $('#login').val(),
      password: $('#password').val(),
    };

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auths/login'
      })
      .done(function(data) {
        if (!data.ok) {
          for (let field of data.fields) {
            $('#' + field).addClass('error');
            document.getElementById(field).oninput=function () {
              $('#' + field).removeClass('error');
            };
          }
        }
        if(data.ok){
          console.log(data.status);
          $(location).attr('href', '/');
        }
      })
  })
