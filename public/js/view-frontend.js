$(document).ready(function(){
    $('.sidenav').sidenav();
    });

    document.addEventListener("DOMContentLoaded", function(){
      const gallery = document.querySelectorAll(".materialboxed");
      M.Materialbox.init(gallery,{});
    });

    $(document).ready(function(){
    $('.modal').modal();
    });

    $(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
    });

    $(document).ready(function() {
    $('input#title, textarea#description, textarea#instruction, textarea#ingredients').characterCounter();
    });

    $(document).ready(function(){
    $('.slider').slider();
    });

    $(document).ready(function(){
$('.tabs').tabs();
});
    
    