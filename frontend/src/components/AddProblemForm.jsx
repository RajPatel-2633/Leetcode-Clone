import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import {Navigate, useNavigate} from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
  }),
});

// Sample problem data for pre-filling the form
// Sample problem data for pre-filling the form
const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testCases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testCases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
       
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}
`,
  },
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP"); // Default to array problem
const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testCases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (value) => {
    try {
      // stringify the data
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      
      console.log(res.data);
      toast.success(res.data.message);
      
      // Refresh problems list before navigating
      console.log("Calling refreshProblems");
      await useProblemStore.getState().refreshProblems();
      
      navigation("/");
    } catch (error) {
      console.log("Error creating problem", error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load sample data
  const loadSampleData = () => {
    const sampleData =
      sampleType === "DP" ? sampledpData : sampleStringProblem;

    // Replace the tags and test cases arrays
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testCases.map((tc) => tc));

    // Reset the form with sample data
    reset(sampleData);
  };

  return (
    <div className="w-full space-y-12">
      {/* 1. Header & Utility Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-[0_0_15px_rgba(var(--p),0.2)]">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Initialize_Module</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Add New Problem to Lab Database</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex gap-1">
            {["DP", "string"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSampleType(type === "DP" ? "array" : "string")} // Preserved your logic
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  sampleType === type ? "bg-primary text-black" : "text-slate-500 hover:text-white"
                }`}
              >
                {type} Template
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={loadSampleData}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Download size={14} />
            Load_Buffer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* SECTION A: IDENTITY & PARAMETERS */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <span className="size-2 rounded-full bg-primary animate-pulse" />
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sector_01: Identity</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Module Title</label>
              <input
                type="text"
                {...register("title")}
                className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary/50 outline-none transition-all font-bold ${errors.title ? "border-red-500/50" : ""}`}
                placeholder="Enter problem title..."
              />
              {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Difficulty_Rating</label>
              <select
                {...register("difficulty")}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-primary/50 outline-none appearance-none font-bold text-primary"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description_Payload</label>
              <textarea
                {...register("description")}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:border-primary/50 outline-none min-h-[200px] resize-none font-medium leading-relaxed transition-all"
                placeholder="Detailed problem logic here..."
              />
              {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION B: CLASSIFICATION (TAGS) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sector_02: Classification</h3>
            </div>
            <button
              type="button"
              onClick={() => appendTag("")}
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
            >
              + Add_Tag
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {tagFields.map((field, index) => (
              <motion.div 
                key={field.id} 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <input
                  type="text"
                  {...register(`tags.${index}`)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-bold focus:border-primary/50 outline-none transition-all pr-8"
                  placeholder="Tag..."
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  disabled={tagFields.length === 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION C: VALIDATION (TEST CASES) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sector_03: Validation_Nodes</h3>
            </div>
            <button
              type="button"
              onClick={() => appendTestCase({ input: "", output: "" })}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
            >
              <Plus size={12} /> New_Node
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {testCaseFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-black/40 border border-white/5 rounded-3xl p-6 space-y-4 relative overflow-hidden group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">NODE_{index + 1}</span>
                    <button type="button" onClick={() => removeTestCase(index)} disabled={testCaseFields.length === 1} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Input_Stream</label>
                        <textarea {...register(`testCases.${index}.input`)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono outline-none focus:border-blue-500/50 min-h-[80px] resize-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Expected_Return</label>
                        <textarea {...register(`testCases.${index}.output`)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-mono outline-none focus:border-emerald-500/50 min-h-[80px] resize-none" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION D: SOURCE TEMPLATES */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <span className="size-2 rounded-full bg-purple-500 animate-pulse" />
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sector_04: Source_Templates</h3>
          </div>

          <div className="space-y-12">
            {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
              <div key={language} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="bg-black/40 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code2 className="text-primary" size={18} />
                    <span className="font-black italic uppercase tracking-tighter text-xl">{language}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Starter Code */}
                  <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Terminal size={12}/> Starter_Code
                    </h4>
                    <div className="border border-white/10 rounded-2xl overflow-hidden h-[300px]">
                      <Controller
                        name={`codeSnippets.${language}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="100%"
                            language={language.toLowerCase()}
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            options={{ minimap: { enabled: false }, fontSize: 13, padding: {top: 10} }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Reference Solution */}
                  <div className="p-8 space-y-4 bg-primary/5">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={12}/> Reference_Solution
                    </h4>
                    <div className="border border-primary/20 rounded-2xl overflow-hidden h-[300px]">
                      <Controller
                        name={`referenceSolutions.${language}`}
                        control={control}
                        render={({ field }) => (
                          <Editor
                            height="100%"
                            language={language.toLowerCase()}
                            theme="vs-dark"
                            value={field.value}
                            onChange={field.onChange}
                            options={{ minimap: { enabled: false }, fontSize: 13, padding: {top: 10} }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Language Specific Examples */}
                <div className="p-8 bg-black/20 border-t border-white/5">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Example_In</label>
                        <textarea {...register(`examples.${language}.input`)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none min-h-[60px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Example_Out</label>
                        <textarea {...register(`examples.${language}.output`)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none min-h-[60px]" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Explanation</label>
                        <textarea {...register(`examples.${language}.explanation`)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none min-h-[60px]" />
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION E: SUPPLEMENTARY DATA */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-8">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Sector_05: Metadata</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Constraints</label>
                <textarea {...register("constraints")} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs min-h-[100px] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hints</label>
                <textarea {...register("hints")} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs min-h-[100px] outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Editorial</label>
                <textarea {...register("editorial")} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs min-h-[100px] outline-none" />
              </div>
           </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end pt-8 border-t border-white/5">
          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative px-12 py-5 bg-primary text-black font-black uppercase italic tracking-tighter rounded-2xl shadow-[0_0_30px_rgba(var(--p),0.4)] hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
              <span className="flex items-center gap-3">
                <CheckCircle2 size={20} />
                Finalize_Injection
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblemForm;