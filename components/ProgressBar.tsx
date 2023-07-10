import { MotionValue, motion, useSpring } from "framer-motion";

export default function ProgressBar({ value }: { value: MotionValue<number> }) {
  const width = useSpring(value, { damping: 20 });
  return (
    <motion.div className="flex h-6 w-full flex-row items-start justify-start">
      <motion.div
        className="h-full w-full bg-green-500"
        style={{ scaleX: width, originX: 0 }}
        transition={{ ease: "easeIn" }}
      />
    </motion.div>
  );
}
