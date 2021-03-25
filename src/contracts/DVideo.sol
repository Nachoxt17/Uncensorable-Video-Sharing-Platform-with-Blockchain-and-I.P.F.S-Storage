pragma solidity ^0.5.0;


/**+-Steps for the Video being available in the Platform:_
+-(1)-Model the Video, giving it a Data Structure.
+-(2)-Store the Video.
+-(3)-Upload Video.
+-(4)-List Video.*/

contract DVideo {
  uint public videoCount = 0;
  string public name = "DVideo";
  /**+-(2)-Store the Video.*/
  /**+-(4)-List Video.*/
  //+-Create id=>struct mapping:_
  mapping(uint => Video) public videos;

  /**+-(1)-Model the Video.*/
  //+-Create Struct:_
  struct Video {
    uint id;
    string hash;
    string title;
    address author;
  }

  //Create a "Video Uploaded" Event Listener.
  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );


  constructor() public {
  }

  /**+-(3)-Upload Video.*/
  function uploadVideo(string memory _videoHash, string memory _title) public {/**(We use "memory" in the Arguments of this Func. because the Uploading process is temporary).*/
    //+-Make sure the video hash exists before doing anything:_
    require(bytes(_videoHash).length > 0);
    //+-Make sure video title exists:_
    require(bytes(_title).length > 0);
    //+-Make sure uploader address exists:_
    require(msg.sender != address(0));

    //+-Increment video id:_
    videoCount ++;

    //+-Add video to the contract:_
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);

    //+-Trigger the "Video Uploaded" Event Listener.:_
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);
  }
}
