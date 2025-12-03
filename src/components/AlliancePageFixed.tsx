// This is a simplified version of the Rankings section for the Alliance page
// Copy the relevant parts to the main AlliancePage.tsx

<div className="space-y-3">
  {topAlliances.map((alliance) => (
    <motion.div
      key={alliance.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: alliance.rank * 0.05,
      }}
      className={`p-4 rounded-lg border transition-all duration-300 ${
        alliance.name === "The Grind Squad"
          ? "bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
          : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Rank Badge */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
            alliance.rank === 1
              ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black"
              : alliance.rank === 2
                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
                : alliance.rank === 3
                  ? "bg-gradient-to-br from-orange-400 to-orange-600 text-black"
                  : alliance.name === "The Grind Squad"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300"
          }`}
        >
          #{alliance.rank}
        </div>

        {/* Alliance Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{alliance.badge}</span>
            <span
              className={`font-bold ${
                alliance.name === "The Grind Squad"
                  ? "text-purple-300"
                  : "text-white"
              }`}
              style={{ fontSize: "16px" }}
            >
              {alliance.name}
            </span>
            {alliance.name === "The Grind Squad" && (
              <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                YOUR ALLIANCE
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{alliance.members}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{alliance.totalXP.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>Lvl {alliance.averageLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</div>;