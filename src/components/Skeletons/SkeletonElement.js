import styles from './Skeleton.module.css'

const SkeletonElement = ({type}) => {
    return ( 
        <div className={[styles.skeleton, styles[type]].join(' ')}></div>
     );
}
 
export default SkeletonElement;