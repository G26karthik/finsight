import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import InsightsPanel from '../components/insights/InsightsPanel';

export default function Insights() {
  return (
    <>
      <Header title="Insights" subtitle="Spending patterns and analysis" />
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <InsightsPanel />
        </motion.div>
      </div>
    </>
  );
}

