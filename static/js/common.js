var mapSearchByAddess = function( map , targetId , geoInput , $name , $address){

    var $name_val = $name.val().trim();
    var $address_val = $address.val().trim();

    // 12글자를 넘어서면... 처리
    if($name_val.length > 12){
        $name_val = $name_val.slice( 0 , 12 ) + "...";
    }

    // 주소-좌표 변환 객체를 생성
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색
    geocoder.addressSearch( $address_val , function(result, status) {

        if(status == kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            //좌표 저장
            $(geoInput).val(
                result[0].x + ',' + result[0].y
            );

            // var imageStar = '../images/marker_star.png';
            var imageSrc = 'https://t1.kakaocdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
            var imageSize = new kakao.maps.Size(24, 35); 

            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            var marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage
            });

            // 인포윈도우로 장소에 대한 설명을 표시
            var infowindow = new kakao.maps.InfoWindow({
                content: 
                    '<div style="width:150px;text-align:center;padding:6px 2px;"> \
                        '+$name_val+' \
                    </div>'
            });
            infowindow.open(map, marker);

            map.setCenter(coords);
            $(targetId).css( 'visibility' , 'visible' );
        } else {
            alert('데이터가 존재하지 않습니다. 다시 검색해주세요.');

            // 좌표 및 인풋 초기화
            $(geoInput).val('');
            $address.val('');
            $(targetId).css( 'visibility' , 'hidden' );
        }
    });

};