/**
 * Created by Andy on 25/9/17.
 */
import React, {Component} from 'react';
import styles from './ProgramCatalogue.css';
import ProgramCard from './ProgramCard';
import OwlCarousel from 'react-owl-carousel2';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';

class ProgramFaculty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            programs: [],
            name: '',
            length: 4,
            position: 0
        }
    }

    componentWillMount() {
        const faculty = Object.keys(this.props.programFaculty);
        const programs = this.props.programFaculty[faculty].programs;

        if (programs.length > 0) {
            this.setState({
                programs: programs,
                name: faculty
            })
        } else {
            this.setState({
                programs: null
            });
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
        if(window.innerWidth > 960) {
            this.setState({ length: 4 });
        } else if (window.innerWidth > 640) {
            this.setState({ length: 2 });
        } else {
            this.setState({ length: 1 });
        }
    }

    handleNext = name => {
        let position = this.state.position;
        this.setState({
            position: position + 1
        });
        this.refs[name].next()
    }

    handlePrev = name => {
        let position = this.state.position;
        this.setState({
            position: position - 1
        });
        this.refs[name].prev()
    }

    render() {
        const programs = this.state.programs;
        const name = this.state.name;
        const options = {
            items: 3,
            nav: false,
            margin:16,
            dots: false,
            responsive:{
                0:{
                    items:1
                },
                640: {
                    items:2
                },
                960:{
                    items:4
                }
            }
        };

        return (
            (programs)
                ? ( <div className={styles.facultyRow}>
                        <h2>{name}</h2>
                        <div className={styles.carousel}>
                            <OwlCarousel ref={name} options={options}>
                                {programs.map((program,index) => {
                                    return (
                                        <div key={index} className="item">
                                            <ProgramCard program={program} />
                                        </div>
                                    )
                                })}
                            </OwlCarousel>
                            {(programs.length > this.state.length && this.state.position > 0) ?
                                (<IconButton className={styles.NavPrev} onClick={() => {this.handlePrev(name)}}>
                                    <ChevronLeftIcon/>
                                </IconButton>) : (null)}
                            {(programs.length > this.state.length && this.state.position < programs.length - this.state.position) ? (
                                    <IconButton className={styles.NavNext} onClick={() => {this.handleNext(name)}}>
                                        <ChevronRightIcon/>
                                    </IconButton>) : (null)}
                        </div>

                    </div>
                ) : (null)
        )
    }
}

export default ProgramFaculty;