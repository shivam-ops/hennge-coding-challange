import React from 'react';
import iconArrow02 from '../media/icon_arrow02.svg';
import './EmailList.css';






export default function EmailList (props) {

  return (
      <div className="email">
        <div
          className="email__go-back"
          onClick={ ()=> props.setViewEmailID(null) }>
          <img
            className="icon-back"
            src={ iconArrow02 } alt="Icon back" />
            Go back
        </div>
        <div>
          <div className="email__field"><strong>From</strong><br/><br/>{ props.email.from }</div>
          <div className="email__field"><strong>To</strong><br/><br/>{ props.email.to.join(", ") }</div>
          <div className="email__field"><strong>Subject</strong><br/><br/>{ props.email.subject }</div>
          { props.email.attachment.length > 0 && <div className="email__field"><strong>Attachments</strong><br/><br/>{ props.email.attachment.join(", ") }</div>}
          <div className="email__field"><strong>Body</strong><br/><br/>{ props.email.body }</div>
        </div>
      </div>
  )
}