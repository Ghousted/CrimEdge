import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

const LiveStreamComponent = React.forwardRef(({ roomID, roleStr = 'Host', onStreamEnd }, ref) => {
  const role =
    roleStr === 'Host'
      ? ZegoUIKitPrebuilt.Host
      : roleStr === 'Cohost'
      ? ZegoUIKitPrebuilt.Cohost
      : ZegoUIKitPrebuilt.Audience;

  let sharedLinks = [];
  if (role === ZegoUIKitPrebuilt.Host || role === ZegoUIKitPrebuilt.Cohost) {
    sharedLinks.push({
      name: 'Join as co-host',
      url:
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?roomID=' +
        roomID +
        '&role=Cohost',
    });
  }
  sharedLinks.push({
    name: 'Join as audience',
    url:
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      '?roomID=' +
      roomID +
      '&role=Audience',
  });
  // generate Kit Token
  const appID = 1033676820;
  const serverSecret = 'd05cfb82c73bc893030163cc792f1d1f';
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    randomID(5),
    randomID(5)
  );

  const zpRef = React.useRef(null);

  // start the call
  const myMeeting = React.useCallback(async (element) => {
    if (!element) return;
    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    // Use onLeave callback to detect when user leaves the room
    const onLeave = () => {
      if (onStreamEnd) {
        onStreamEnd();
      }
    };

    // start the call
    try {
      await zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role,
          },
        },
        sharedLinks,
        onLeave,
      });
    } catch (error) {
      console.error('Error joining live room:', error);
      if (onStreamEnd) {
        onStreamEnd();
      }
    }
  }, [kitToken, role, sharedLinks, onStreamEnd]);

  React.useImperativeHandle(ref, () => ({
    leaveRoom: () => {
      if (zpRef.current) {
        zpRef.current.leaveRoom();
      }
    },
  }));

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
});

export default LiveStreamComponent;
