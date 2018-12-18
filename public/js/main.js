$(document).ready(function(){
  $('.delete-article').on('click', function(e){    //delete article class
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/articles/'+id,
      success:function(response){
        alert('Deleting Article');
        window.location.href='/';
      },
      error:function(err){
        console.log(err);
        return ;
      }
    });

});
});
