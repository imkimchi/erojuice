fetch('/getData')
  .then(function(res) {
          if(res.status !== 200) {
              console.log('There is a problem, ', res.status);
              return ;
          } 
          res.json().then(function(data) {
              var fragment = document.createDocumentFragment();
              var columns = document.getElementsByClassName('columns');
              var n =0;
              for(var i=0; i<5; i++){
                  var columns = document.createElement('div');
                  columns.className = 'columns';

                  for(var j=0; j<4; j++) {
                      var e = document.createElement("div");
                      e.className = "column is-3 vid";
                      var panel = document.createElement('div');
                      panel.className = "panel";
                      var p = document.createElement('p');
                      p.className = "is-marginless";

                      var a = document.createElement('a');
                      a.href = "https://eroshare.com/"+ data[n].videoId;

                      var img = document.createElement('img');
                      img.src = data[n].thumbnail;
                      a.append(img);
                      p.append(a);
                      panel.append(p);
                      
                      var vidInfo = document.createElement('div');
                      vidInfo.className = "panel vidInfo";
                      var title = document.createElement('a');
                      title.className = "vid-title";
                      var span = document.createElement('span');
                      span.innerText = data[n].title;
                      title.append(span);
                      //vidInfo.append(title);

                      var favs = document.createElement('div');
                      favs.className = "columns has-text-centered";
                      var column = document.createElement('div');
                      column.className = "column";
                      var ups = document.createElement('div');
                      ups.className = "panel-item reddit-ups";
                      var alien = document.createElement('i');
                      alien.className = "fa fa-reddit-alien fa-2x";
                      ups.innerText = data[n].score.toString();
                      ups.append(alien);

                      var date = document.createElement('div');
                      date.className = "panel-item reddit-date";
                      var calender = document.createElement('i');
                      calender.className = "fa fa-calendar fa-2x";
                      date.append(calender);
                      column.append(ups);
                      column.append(date);

                      favs.append(column);
                      vidInfo.append(favs);
                      panel.append(vidInfo);
                      e.append(panel);

                      fragment.appendChild(e);
                      columns.appendChild(e);
                      fragment.appendChild(columns);
                      n++;
                  }
                  document.getElementsByClassName('container')[1].insertBefore(fragment, null);
              }

              
          })
      }
  )
  .catch(function(err) {
      console.log("Fetch Erros -S", err);
  })




/*
<div class="column is-3 vid">
  <div class="panel">
    <p class="is-marginless"><img src="imgSrc"/></p>
    <div class="panel vidInfo">
      <a href="#" class="vid-title"><span>text</span></a>
      <div class="columns has-text-centered">
        <div class="column">
          <div class="panel-item reddit-ups"><i class="fa fa-reddit-alien fa-2x"></i>2 </div>
          <div class="panel-item reddit-date"><i class="fa fa-calendar fa-2x"></i>2d </div>
        </div>
      </div>
    </div>
  </div>
</div>
*/