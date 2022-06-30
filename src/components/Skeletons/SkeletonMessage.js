import SkeletonElement from "./SkeletonElement";
import styles from './Skeleton.module.css';

const SkeletonCard = () => {
    return ( 
        <div className={styles.skeleton_card}>
            <div className={styles.skeleton_wrapper}>
                <div className={styles.shimmer}></div>
                <SkeletonElement type='title' />
                <SkeletonElement type="text" />
                <SkeletonElement type='text' />
            </div>
        </div>
     );
}
 
export default SkeletonCard;