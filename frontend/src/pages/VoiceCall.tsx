import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Styles from "../css/VoiceCall.module.css";

export default function VoiceCall() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [callActive, setCallActive] = useState(false);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  return (
    <div>
      <div></div>
    </div>
  );
}
