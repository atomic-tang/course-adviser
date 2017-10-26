/**
 * Created by Andy on 13/9/17.
 */
import React, {Component} from 'react';
import styles from './CourseSubject.css';
import CourseCard from './CourseCard';
import OwlCarousel from 'react-owl-carousel2';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

class CourseSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses:[],
            name: '',
            length: 4,
            position: 0
        }
    }

    componentWillMount() {
        const courseSubjectID = Object.keys(this.props.courseSubject);
        const courseSubject = this.props.courseSubject[courseSubjectID];
        const courses = courseSubject.courses;

        if (courses.length > 0) {
            this.setState({
                courses: courses,
                name: courseSubject.name
            });
        } else {
            this.setState({
                courses:null
            })
        }

        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentDidMount() {
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    updateDimensions = () => {
        if(window.innerWidth > 1140) {
            this.setState({ length: 4 });
        } else if (window.innerWidth > 960) {
            this.setState({ length: 3 });
        } else if (window.innerWidth > 720) {
            this.setState({ length: 2 });
        } else {
            this.setState({ length: 1 });
        }
    }

    handleNext = () => {
        const courseSubjectID = Object.keys(this.props.courseSubject);
        let position = this.state.position;
        this.setState({
            position: position + 1
        });
        this.refs[courseSubjectID].next()
    }

    handlePrev = () => {
        const courseSubjectID = Object.keys(this.props.courseSubject);
        let position = this.state.position;
        this.setState({
            position: position - 1
        });
        this.refs[courseSubjectID].prev();
    }

    render() {
        const courseSubjectID = Object.keys(this.props.courseSubject);
        const courses = this.state.courses;
        const events = {
            onInitialized: () => {

            },
            onTranslated: () => {

            }
        }
        const options = {
            items: 3,
            nav: false,
            margin:16,
            dots: false,
            responsive:{
                0:{
                    items:1
                },
                720:{
                    items:2
                },
                960:{
                    items:3
                },
                1140: {
                    items:4
                }
            }
        };

        return (
            (courses)
                ? ( <div className={styles.SubjectAreaRow}>
                        <h2>{this.state.name}</h2>
                        <div className={styles.carousel}>
                            <OwlCarousel ref={courseSubjectID} options={options} events={events}>
                                {courses.map((course,index) => {
                                    return(
                                        <div key={Object.keys(course)} className="item">
                                            <CourseCard course={course} />
                                        </div>
                                    )
                                })}
                            </OwlCarousel>
                            {(courses.length > this.state.length && this.state.position > 0) ? (
                                    <IconButton className={styles.NavPrev} onClick={() => {this.handlePrev()}}>
                                        <ChevronLeftIcon/>
                                    </IconButton>) : (null)}
                            {(courses.length > this.state.length && this.state.position < courses.length - this.state.position) ? (
                                    <IconButton className={styles.NavNext} onClick={() => {this.handleNext()}}>
                                        <ChevronRightIcon/>
                                    </IconButton>) : (null)}
                        </div>
                    </div>
                ) : (null)
        )
    }
}

export default CourseSubject;