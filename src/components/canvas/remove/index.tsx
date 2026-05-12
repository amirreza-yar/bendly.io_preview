import { Engine } from '@/lib/flashing/engine/engine';
import { RefObject, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RemoveModeHeader from './header';

export type RemoveModeComponentProps = {
  onSave: () => boolean;
  onCancel: () => boolean;
  canApply: boolean;
};

export function RemoveModeUI({ engine }: { engine: RefObject<Engine> }) {
  const [modeProps, setModeProps] = useState<RemoveModeComponentProps>({
    onSave: () => false,
    onCancel: () => false,
    canApply: false,
  });

  useEffect(() => {
    engine.current?.activeMode?.onUIReady?.(setModeProps);
    engine.current.renderer.centerRenderedContentAnimated(160, 20);
  }, [engine]);

  const onSave = () => {
    if (!engine.current) return;
    const saveRes = modeProps.onSave();

    if (saveRes) {
      engine.current.setMode('draw');
      engine.current.renderer.centerRenderedContentAnimated();
    }
  };

  const onCancel = () => {
    if (!engine.current) return;
    modeProps.onCancel();
    engine.current.setMode('draw');
    engine.current.renderer.centerRenderedContentAnimated();
  };

  return (
    <>
      <motion.header
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      >
        <RemoveModeHeader componentProps={modeProps} onSave={onSave} onCancel={onCancel} />
      </motion.header>
    </>
  );
}
