import React, {useState, useEffect} from 'react';

import uuidv4 from 'uuidv4';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerMobile from 'react-mobile-datepicker';
import { DynamicBadge } from 'react-dynamic-badge';

import ShowEmail from './components/EmailList.js';

import logo from './media/logo.png';
import iconArrow01 from './media/icon_arrow01.svg';
import iconArrow02 from './media/icon_arrow02.svg';
import iconCalendar from './media/icon_calender.svg';
import iconClip from './media/icon_clip.svg';
import iconMailSp from './media/icon_mail_sp.svg';
import iconSearch from './media/icon_search.svg';

import './App.css';


import { data } from './data/data.js';

function App () {

  const [state, setState] = useState({
    emails: data,
    sortOrder: "date",
    ascending: false,
    startDate: new Date("Wed Dec 25 2019 12:00:00 GMT+0900 (Japan Standard Time)"),
    endDate: new Date()
  });
  
  
  const tableHeaders = [
    { field: "From" },
    { field: "To" },
    { field: "Subject" },
    { field: "Date" },
  ];

  
  const [datePickerMobile, setDatePickerMobile] = useState({ start: false, end: false });

  
  const [viewEmails, setViewEmails] = useState(null);

  
  useEffect( ()=> sortMails(state.startDate, state.endDate, state.sortOrder, state.ascending, state.emails),[] );


  const handleSetStartDate = date => {

    setState({...state, startDate: date });   
    setDatePickerMobile({ ...datePickerMobile, start: false });
    sortMails(date, state.endDate, state.sortOrder, state.ascending);
  }

  
  const handleSetEndDate = date => {

    setState({...state, endDate: date });
    setDatePickerMobile({ ...datePickerMobile, end: false });
    sortMails(state.startDate, date, state.sortOrder, state.ascending);
  }

  

  const sortMails = (startDate, endDate, sortOrder, ascending, items) => {

    if (state.sortOrder !== sortOrder) ascending = false;

    let emails;
    items ? emails = items : emails = data;
    emails = data.filter(item=>(item.date > startDate) && (item.date < endDate));
    
     ascending ?
      emails.sort((a, b) =>
        (a[sortOrder] > b[sortOrder]) ? 1 : -1)
      :
      emails.sort((a, b) =>
        (a[sortOrder] < b[sortOrder]) ? 1 : -1);

    setState({ emails: emails, sortOrder: sortOrder, ascending: ascending, startDate: startDate, endDate: endDate });
  }


  const toggleBody = (event, id) => {

    event.stopPropagation();

    document.getElementById("icon" + id).classList.toggle("rotate-90");
    document.getElementById("body" + id).classList.toggle("js-show");
  }

 

  const viewEmail = (id, event) => {

    event.stopPropagation();
    setViewEmails(id);
  }

  

  const ISO = (date) => {

    const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds to be added to toISOString() since it ignores local timezone
    const localISOTime = (new Date(date - timeZoneOffset)).toISOString().slice(0, -1).split('T')[0].toString().replace(/-/g, "/");
    return localISOTime;
  }



  const formatDate = (date) => {
  
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    const today = ISO(new Date());
  
    if (today === ISO(date)) {
  
      let hours = date.getHours();
      hours = ("0" + hours).slice(-2);
  
      let minutes = date.getMinutes();
      minutes = ("0" + minutes).slice(-2);
      return hours + ":" + minutes;
    }
  
    if (new Date(today).getMonth() === new Date(date).getMonth()) {

      let days = date.getDate();
      days = ("0" + days).slice(-2);
      return monthNames[new Date(date).getMonth()] + " " + days
    }
  
    return ISO(date)
  }

 
  const setSorIcon = (header, sortOrder, ascending) => {

    if (sortOrder === header.toLowerCase()) {
      sortOrder === "date" && (ascending = !ascending);
      return <img className={ ascending ? "icon-sort" : "icon-sort flipped" } src={ iconArrow01 } alt="Icon arrow" />
    }
  }



  const setHeaderClass = (header) => {

    switch (header.toLowerCase()) {
      case "from":
        return "list__header__from"
      case "to":
          return "list__header__to"
      case "subject":
          return "list__header__subject"
      case "date":
          return "list__header__date"
      default:
        return null;
    }

  }

  return (

    <div className="App">
      
    

      { viewEmails === null ?

        <React.Fragment>

          <header className="App-header">

            <div className="dpicker-wrapper ">
              <div className="dpicker">
                <img className="icon" src={ iconCalendar } alt="Calendar icon"/>

                <div className="desktop-datepicker">

                  <DatePicker
                    className="dpicker__input"
                    dateFormat="yyyy/MM/dd"
                    selected={state.startDate}
                    onChange={handleSetStartDate}
                    showYearDropdown
                  />-&nbsp;
                  <DatePicker
                    className="dpicker__input"
                    dateFormat="yyyy/MM/dd"
                    selected={state.endDate}
                    onChange={handleSetEndDate}
                    showYearDropdown
                  />

                </div>

                <div className="mobile-datepicker">

                  <div
                    onClick={ ()=> setDatePickerMobile({ ...datePickerMobile, start: true }) }>
                    { ISO(state.startDate) }
                  </div>

                  <DatePickerMobile
                    confirmText="OK"
                    cancelText="Cancel"
                    value={ state.startDate }
                    isOpen={ datePickerMobile.start }
                    onSelect={ handleSetStartDate }
                    onCancel={ ()=> setDatePickerMobile({ ...datePickerMobile, start: false }) } />

                  &nbsp;-&nbsp;

                  <div
                    onClick={ ()=> setDatePickerMobile({ ...datePickerMobile, end: true }) }>
                    { ISO(state.endDate) }
                  </div>

                  <DatePickerMobile
                    confirmText="OK"
                    cancelText="Cancel"
                    value={ state.endDate }
                    isOpen={ datePickerMobile.end }
                    onSelect={ handleSetEndDate }
                    onCancel={ ()=> setDatePickerMobile({ ...datePickerMobile, end: false }) } />

                  </div>

              </div>

              <div className="dpicker__bnt-search" onClick={ ()=> sortMails( state.startDate, state.endDate, state.sortOrder, state.ascending )}>
                <img className="icon" src={ iconSearch } alt="Search icon"/>
              </div>
            </div>

            <div className="div-state-counter">
              <span><strong>Results: <span className="big-text">{ (state.emails) ? state.emails.length : 0 }</span>mail(s)</strong></span>
              {(state.length === 0) && <hr style={{ marginTop: '1px' }}/>}
            </div>

          </header>

          <main>

              <div className="list">

                { state.emails.length > 0 ?

                  <div className="list__headers">

                    {tableHeaders.map( (headerTitle, i) =>
                      <div
                        key={ uuidv4() }
                        className={ "list__headers__header " + setHeaderClass(headerTitle.field) }
                        onClick={() => { sortMails( state.startDate, state.endDate, headerTitle.field.toLowerCase(), !state.ascending, state.emails ) }}>
                        { <div>
                              <span style={{ color: state.sortOrder === headerTitle.field.toLowerCase() ? "black" : "var(--dark-grey)" }}>
                                { headerTitle.field }
                              </span>
                          </div> }
                          { setSorIcon( headerTitle.field, state.sortOrder, state.ascending ) }
                      </div>
                    )}

                  </div>
                  :
                  <div className="line"></div>
                }

                {state.emails.map(( result ) =>

                  <div
                    className="js-desktop-onclick"
                    key={ result.id }>

                    <div
                      onClick={ (e)=> toggleBody( e, result.id )}
                      className="list__item"
                      >

                      <div className="list__item__actors">
                        <div className="list__item__icon-email">
                          <img className="icon-email" src={ iconMailSp } alt="Icon email" />
                        </div>
                        <div className="list__actors__from-to">

                          <div
                            title={ result.from }
                            className={ "list__actors__from" + (state.sortOrder === "from" ? " bold-me" : "") }>
                            <div className="ellipsis">
                              { result.from }
                            </div>

                            <div className="list__item__text-icon">
                              { result.attachment.length > 0 && <img className="icon" src={ iconClip } alt="Icon clip" title={ result.attachment.join(", ") } />}

                              <span
                                onClick={ (e)=> viewEmail( result.id, e ) }
                                style={{ fontWeight: "normal" }}>
                                  { formatDate( result.date) }
                              </span>

                              <img className="icon-small icon-expand" src={ iconArrow02 } alt="Icon arrow" />
                            </div>
                          </div>

                          <div className="list__actors__to_wrapper">

                          <div
                            title={ result.to }
                            className={ "list__actors__to ellipsis" + (state.sortOrder === "to" ? " bold-me" : "") }>
                            <DynamicBadge items={ result.to } />
                          </div>

                          </div>

                        
                          <div className="list__subject">

                            <div
                              title={ result.subject }
                              className={ "ellipsis" + (state.sortOrder === "subject" ? " bold-me" : "") }>
                              { result.subject }
                            </div>

                            <div style={{ display: result.attachment.length > 0 ? "block" : "none", marginRight: "10px" }}>
                              <svg  
                                className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.93083 15">
                                <title>icon_clip</title>
                                <path className="a" d="M6.799,3.6254A2.30522,2.30522,0,1,0,3.56718,6.85622l4.304,4.304a.5222.5222,0,0,0,.7385-.7385l-4.304-4.304c-.53586-.53586-.87743-1.33808-.23084-1.98466.64553-.64659,1.4488-.304,1.98466.23189L11.032,9.3364c1.90632,1.90841,2.38159,2.78793,1.24615,3.92441-1.149,1.148-2.367.86385-4.20121-.96935L2.367,6.57941C1.1741,5.38653.33845,3.43842,1.90633,1.87159c1.86141-1.86141,3.98708-.03134,4.59293.57555l5.11038,5.11142a.5222.5222,0,0,0,.7385-.7385L7.23776,1.70864C5.18625-.34288,2.86-.56223,1.16678,1.13308c-1.711,1.71-1.5261,4.196.4617,6.18484l5.711,5.711C7.96726,13.6567,9.31161,15,10.85756,15a3.01214,3.01214,0,0,0,2.16014-1.00173c2.07554-2.07658.15564-3.99857-1.24616-5.40141Z"/>
                              </svg>
                            </div>

                          </div>

                          <div className={ "list__date" + (state.sortOrder === "date" ? " bold-me" : "") }>
                            <span>{ formatDate( result.date) }</span>
                          </div>

                        </div>
                      </div>

                      <div
                        className="list__item__subject"
                        onClick={ (e)=> toggleBody( e, result.id )}>

                        <div className="list__item__text-icon">
                          <img id={ "icon" + result.id } className="icon-small icon-body-arrow" src={ iconArrow02 } alt="Icon arrow" />
                        </div>

                        <div className="ellipsis">
                          { result.subject }
                        </div>

                      </div>

                      <div
                        id={ "body" + result.id }
                        onClick={ (e)=> toggleBody( e, result.id )}
                        title="CLick to hide email body"
                        className="js-show-body">
                        <div
                          className="list__item__email">
                          <div>⤷</div><span style={{ marginTop: "5px", marginRight: "0", color: "black" }}>{ result.body }</span>
                        </div>
                      </div>

                    </div>

                  </div>

                )}

                { state.emails.length === 0 &&
                    <div className="App-logo">
                        <img src={ logo } alt="Logo" />
                    </div>
                }

              </div>

          </main>

          </React.Fragment>

        :

         
          <ShowEmail
            setViewEmails={ setViewEmails }
            email={ state.emails.filter( e => e.id === viewEmails )[0] }
          />}

    </div>

  );
}

export default App;

