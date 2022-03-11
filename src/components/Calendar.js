import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "../css/Calendar.css";
import Day from "./Day";

export default function Calendar() {
    const [initDate, setInitDate] = useState("");//Date invariable
    const [day, setDay] = useState("");//Numéro du jour invariable
    const [month, setMonth] = useState("");//Mois actuel peut varier
    const [year, setYear] = useState("");// Année actuel peut varier
    const [currentDate, setCurrentDate] = useState("");//Date qui peut varier
    const [start, setStart] = useState(0);
    const [isHighlight, setIsHighlight] = useState(true);
    const [numberOfDays, setNumberOfDays] = useState("");// Nombre de jours du mois
    const [firstDay, setFirstDay] = useState("");//Jour par lequel commence le mois
    const [form, setForm] = useState({title: "" , body : "", date : ""}) 
    const [formDate, setFormDate] = useState(null)
    const [previousMonthDays, setPreviousMonthDays] = useState(null)
    const [events, setEvents] = useState(null)
    const itemsRef = useRef([]);
    const nameOfDays = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
    ];
    useEffect(() => {
        setCurrentData();
    }, []);


    const settings = async (current) => {
        

        const month = current.toLocaleString("fr", { month: "long" });
        const year = current.getFullYear();
        const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
        const numberDays = new Date(year, current.getMonth() + 1, 0).getDate();
        const previousMonthDays = new Date(year, current.getMonth(), 0).getDate();
        const start = firstDay.getDay() == 0 ? 6 : firstDay.getDay() - 1;
        setStart(start)
        setCurrentDate(current);
        setYear(year);
        setMonth(month);
        setFirstDay(firstDay.getDay());
        setPreviousMonthDays(previousMonthDays)
        setNumberOfDays(numberDays);
        // displayDays(start, numberDays, previousMonthDays)
        getEvents(current, year, start - 1)
    }

    const highlightToday= (date , bool) => {

        if(bool){
            itemsRef.current[date].style.backgroundColor = '#9853BA';
            // const day = document.querySelector("#day_" + (date));
            // day.style.backgroundColor = "yellow";
        }else{
            itemsRef.current[date].style.backgroundColor = 'transparent';

        }
        
    }

    const displayDays = (start, numberDays, previousMonthDays) => {
        let cmp = 0;//Actual month days
        let cmp2 = 0;//Next month days


        let previousMonthStart = previousMonthDays + 1 - start;
        let currentMonthStart = start;
        for (let i = 0 ; i < 42 ; i++) {
            if(i >= currentMonthStart && (cmp + 1 <= numberDays)){//Current month
                cmp ++;
                const day = document.querySelector("#day_"+i);
                day.innerHTML = `<p class="day-number">${cmp}</p>`;  ;   
            }else if(i < currentMonthStart){//Previous month
                const day = document.querySelector("#day_"+i);
                day.innerHTML = `<p class="day-number">${previousMonthStart}</p>`;  
                day.style.opacity = 0.6;    

                previousMonthStart ++;

            }else{//Next Month
                cmp2++;
                const day = document.querySelector("#day_"+ i);
                day.innerHTML = `<p class="day-number">${cmp2}</p>`;  ; 
                day.style.opacity = 0.6;    

            }
        }
        
    }
    const getEvents = async (date, year, start ) => {
        const response = await fetch("http://localhost:3001/events",{method:"GET"});
        const json = await response.json();
        // console.log(new Date(json[0].date).getMonth())
        const result = json.filter(json => (new Date(json.date).getMonth() == date.getMonth()) && (new Date(json.date).getFullYear() == year) )
        // displayEvents(result, start)
        setEvents(result);
    }
    const setCurrentData = () => {
        const date = new Date();
        const month = date.toLocaleString("fr", { month: "long" });
        const year = date.getFullYear();
        const day = date.getDate();
        setInitDate(date);
        setDay(day)
        setYear(year);
        setMonth(month);
        setCurrentDate(date);
        highlightToday(day, 1);
        settings(date);
    };


    const verifDate = (current) => {
        if(current.getMonth() === initDate.getMonth() && current.getFullYear() === initDate.getFullYear()){
            highlightToday(initDate.getDate(), 1)
        }else{
            highlightToday(initDate.getDate(), 0)
        }
    }
    const incrementMonth = () => {
        const current = new Date(currentDate.getFullYear(),currentDate.getMonth() + 1,1);
        verifDate(current)
        clearCalendar()
        settings(current);        
    };
    const incrementYear = () => {
        const current = new Date(currentDate.getFullYear() + 1,currentDate.getMonth(),1);
        verifDate(current)
        clearCalendar()
        settings(current);        
    };
    const decrementYear = () => {
        const current = new Date(currentDate.getFullYear() - 1,currentDate.getMonth(),1);
        verifDate(current)
        clearCalendar()
        settings(current);        
    };
    const clearCalendar = () => {
        for (let index = 0; index < 42; index++) {
            // const day = document.querySelector("#day_"+index);
            // day.innerHTML = ""; 
            // day.style.opacity = 1;    

        }
    }
    const decrementMonth = () => {
        const current = new Date(currentDate.getFullYear(),currentDate.getMonth() - 1,1);

        verifDate(current)
        clearCalendar()
        settings(current);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("http://localhost:3001/events",{
           title : form.title,
           body : form.body,
           date : formDate
        })
        setForm({date:'',body:'',title:''})
    }
   
    function onChange(e){
        const { name, value}= e.target;
        setForm(prevForm => {return {...prevForm , [name]:value}})
    }
    const selectDay = (e) =>{
        const date = year+"/"+(currentDate.getMonth()+1)+"/"+e.target.innerHTML
        if(e.target.style.opacity == 0.6){
            alert('Veuillez selectionner un jour du mois actuel')
        }else{
            setForm( prevForm => {return {...prevForm ,['date']: e.target.innerHTML + '/' + (currentDate.getMonth()+1) + '/' + year}} )
            setFormDate(new Date(date))
        }
    }
    let cmp = 0;//Actual month days
    let cmp2 = 0;//Next month days
    let previousMonthStart = previousMonthDays + 1 - start;
    let currentMonthStart = start;
    return (
        <div className="main">
            <div>
                <div className="top">
                <p>Désolé pour la qualité de la CSS et du code je n'avais vraiment pas beaucoup de temps cette semaine</p>

                    <div className="month">
                        <button className="pointer" onClick={decrementMonth}>{'<<'}</button>
                        <p>{month}</p>
                        <button className="pointer" onClick={incrementMonth}>{">>"}</button>
                    </div>
                    <div className="month">
                        <button className="pointer" onClick={decrementYear}>{"<<"}</button>
                        <p>{year}</p>
                        <button className="pointer" onClick={incrementYear}>{">>"}</button>
                    </div>
                </div>
                <div id="garden" className="calendar">
                    {nameOfDays.map((item) => {
                        return (
                            <div key={item + "super"} className="day">
                                {item}
                            </div>
                        );
                    })}
                    {[...Array(42)].map((e, i) => {

                        if(i >= currentMonthStart && (cmp + 1 <= numberOfDays)){//Current month
                            cmp ++;
                            if (events != null){
                                const result = events.filter(el => new Date(el.date).getDate() + (start - 1) === i)
                                return <div key={i + 'div'} ref={el => itemsRef.current[i] = el} className="day"><Day selectDay={selectDay} event={result} cmp={cmp}/></div>
                            }
                            else
                                return <div key={i + 'div'} ref={el => itemsRef.current[i] = el} className="day"><Day selectDay={selectDay} event={[]} cmp={cmp}/></div>
                        }else if(i < currentMonthStart){//Previous month

                            previousMonthStart ++;
                            return <div key={i + 'div'} ref={el => itemsRef.current[i] = el} className="day"><Day selectDay={selectDay} opacity={true} cmp={previousMonthStart -1}/></div>
                            
            
                        }else{//Next Month
                            cmp2++;
                            return <div key={i + 'div'} ref={el => itemsRef.current[i] = el} className="day"><Day selectDay={selectDay} opacity={true} cmp={cmp2}/></div>

                        }
                        
                    })}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    <h1>Ajouter un rendez-vous</h1>
                    <input type="text" name="title" required className="form-control d-block" placeholder="title" onChange={onChange} /><br></br>
                    <input type="text" name="body" required className="form-control d-block my-4" placeholder="body"  onChange={onChange} /><br></br>
                    <input type="text" disabled name="date" required className="form-control d-block my-4" placeholder="date" value={form.date}  onChange={onChange} /><br></br> 
                    <input type="submit" className="btn btn-outline-dark"/>
                </div>
               
            </form>
        </div>
    );
}
