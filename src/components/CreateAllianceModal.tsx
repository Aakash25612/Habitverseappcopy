import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Crown, Users, Shield, Lock, Globe, Sparkles, Check, ChevronRight } from 'lucide-react';

interface CreateAllianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAlliance: (allianceData: AllianceData) => void;
}

export interface AllianceData {
  name: string;
  motto: string;
  icon: string;
  isPrivate: boolean;
}

const allianceIcons = [
  '🔥', '⚡', '💪', '🚀', '⚔️', '🛡️', '👑', '💎',
  '🌟', '🎯', '🏆', '💫', '✨', '🔱', '⭐', '🌙',
  '🎮', '🏹', '🗡️', '🎪', '🌈', '🎨', '🎭', '🎪'
];

export function CreateAllianceModal({ isOpen, onClose, onCreateAlliance }: CreateAllianceModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [allianceName, setAllianceName] = useState('');
  const [allianceMotto, setAllianceMotto] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('👑');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleClose = () => {
    // Reset state
    setStep(1);
    setAllianceName('');
    setAllianceMotto('');
    setSelectedIcon('👑');
    setIsPrivate(false);
    onClose();
  };

  const handleCreate = () => {
    onCreateAlliance({
      name: allianceName,
      motto: allianceMotto,
      icon: selectedIcon,
      isPrivate
    });
    handleClose();
  };

  const canProceedFromStep1 = allianceName.trim().length >= 3;
  const canProceedFromStep2 = allianceMotto.trim().length >= 10;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-400">
            <Crown className="w-6 h-6" />
            Create Your Alliance
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Build your own legendary alliance
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-purple-500' : s < step ? 'w-6 bg-purple-600' : 'w-6 bg-gray-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Alliance Name & Icon */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Icon Selection */}
              <div className="space-y-3">
                <label className="block text-sm text-gray-300">Choose Your Icon</label>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                  <div className="grid grid-cols-8 gap-2">
                    {allianceIcons.map((icon) => (
                      <motion.button
                        key={icon}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition-all duration-200 ${
                          selectedIcon === icon
                            ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                            : 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600'
                        }`}
                      >
                        {icon}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alliance Name */}
              <div className="space-y-3">
                <label className="block text-sm text-gray-300">Alliance Name</label>
                <Input
                  value={allianceName}
                  onChange={(e) => setAllianceName(e.target.value)}
                  placeholder="Enter alliance name..."
                  maxLength={30}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Min. 3 characters</span>
                  <span className={`${allianceName.length >= 3 ? 'text-green-400' : 'text-gray-500'}`}>
                    {allianceName.length}/30
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-br from-purple-900/30 via-gray-800/50 to-gray-900/30 border border-purple-500/30 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-2">Preview</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-2xl">
                    {selectedIcon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">
                      {allianceName || 'Your Alliance Name'}
                    </div>
                    <div className="text-gray-400 text-sm">0 Members</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedFromStep1}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Alliance Motto */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <label className="block text-sm text-gray-300">Alliance Motto</label>
                <Textarea
                  value={allianceMotto}
                  onChange={(e) => setAllianceMotto(e.target.value)}
                  placeholder="What does your alliance stand for? Write a motivational motto..."
                  maxLength={150}
                  rows={4}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 resize-none"
                />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Min. 10 characters</span>
                  <span className={`${allianceMotto.length >= 10 ? 'text-green-400' : 'text-gray-500'}`}>
                    {allianceMotto.length}/150
                  </span>
                </div>
              </div>

              {/* Suggested Mottos */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Need inspiration?</div>
                <div className="space-y-2">
                  {[
                    'Consistency beats perfection. Small daily wins create massive transformations.',
                    'Together we rise, together we grind, together we conquer.',
                    'No excuses, just results. Every day is an opportunity to level up.',
                    'Building legends one habit at a time.'
                  ].map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setAllianceMotto(suggestion)}
                      className="w-full text-left bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-purple-500/50 rounded-lg p-3 text-sm text-gray-300 transition-all duration-200"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedFromStep2}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Privacy Settings & Final Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Privacy Settings */}
              <div className="space-y-3">
                <label className="block text-sm text-gray-300">Privacy Settings</label>
                <div className="space-y-3">
                  {/* Public Option */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsPrivate(false)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                      !isPrivate
                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        !isPrivate ? 'bg-purple-600' : 'bg-gray-700'
                      }`}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">Public Alliance</span>
                          {!isPrivate && <Check className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-sm text-gray-400">
                          Anyone can discover and request to join your alliance
                        </p>
                      </div>
                    </div>
                  </motion.button>

                  {/* Private Option */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsPrivate(true)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                      isPrivate
                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isPrivate ? 'bg-purple-600' : 'bg-gray-700'
                      }`}>
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">Private Alliance</span>
                          {isPrivate && <Check className="w-4 h-4 text-green-400" />}
                        </div>
                        <p className="text-sm text-gray-400">
                          Only members with your invite code can join
                        </p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Final Preview */}
              <div className="bg-gradient-to-br from-purple-900/30 via-gray-800/50 to-gray-900/30 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-purple-400 font-bold">FINAL PREVIEW</span>
                </div>
                
                <div className="space-y-3">
                  {/* Alliance Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-700/50">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-3xl">
                      {selectedIcon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{allianceName}</span>
                        {isPrivate ? (
                          <Lock className="w-3 h-3 text-gray-400" />
                        ) : (
                          <Globe className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                      <div className="text-gray-400 text-sm flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        1 Member (You)
                      </div>
                    </div>
                  </div>

                  {/* Motto */}
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Motto</div>
                    <p className="text-sm text-gray-300 italic">
                      &ldquo;{allianceMotto}&rdquo;
                    </p>
                  </div>

                  {/* Privacy Badge */}
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-400">
                      {isPrivate ? 'Private - Invite Only' : 'Public - Open to Requests'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Create Alliance
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
