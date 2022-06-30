import SkeletonElement from "./SkeletonElement";
import styles from './Skeleton.module.css';

const SkeletonChat = () => {
    return ( 
        <div className={styles.chats}>
            <div className={styles.skeleton_wrapper}>
                <div className={styles.shimmer}></div>
                <SkeletonElement type='chat' />
                <SkeletonElement type='chat_left' />
            </div>
        </div>
     );
}
 
export default SkeletonChat;